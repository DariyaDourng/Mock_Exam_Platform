<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class MigrateFilesToCloudinary extends Command
{
    protected $signature = 'migrate:files-to-cloudinary';
    protected $description = 'Upload question images from local storage to Cloudinary and update DB URLs';

    public function handle()
    {
        $this->info('Starting migration...');

        $questions = DB::table('questions')->select('id', 'question_image')->get();

        foreach ($questions as $question) {
            $filename = $question->question_image;

            if (empty($filename)) {
                $this->warn("Question ID {$question->id} has no image, skipping.");
                continue;
            }

            if (str_starts_with($filename, 'questions/')) {
                $filePath = storage_path('app/public/' . $filename);
            } else {
                $filePath = storage_path('app/public/questions/' . $filename);
            }

            if (!file_exists($filePath)) {
                $this->error("File not found: {$filePath}");
                continue;
            }

            try {
                $this->info("Uploading: {$filePath}");

                $uploadedFile = Cloudinary::upload($filePath, [
                    'folder' => 'mock-exam/questions',
                    'resource_type' => 'auto',
                ]);

                $secureUrl = $uploadedFile->getSecurePath();

                DB::table('questions')->where('id', $question->id)->update([
                    'question_image' => $secureUrl,
                ]);

                $this->info("Uploaded and updated Question ID {$question->id}.");
            } catch (\Exception $e) {
                $this->error("Failed to upload Question ID {$question->id}: " . $e->getMessage());
            }
        }

        $this->info('Migration completed!');
    }
}
