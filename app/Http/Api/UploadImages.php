<?php

namespace App\Http\Api;
use Gumlet\ImageResize;
use Gumlet\ImageResizeException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

trait UploadImageBase64Trait
{
    public function uploadImageBase64Format($base64, $path = '', $feature = ''): ?string
    {
        
    if (empty($base64)) {
        return null; // No image to upload
    }

    $allowed = ['png', 'jpg', 'jpeg'];
    
    // Extract base64 string if it includes data:image
    if (explode("/", $base64)[0] == "data:image") {
        $base64 = explode(";base64,", $base64)[1];
    }

    // Decode the base64 string
    $data = base64_decode($base64);
    if ($data === false) {
        return null; // Return null if decoding fails
    }

    // Get the image type
    $f = finfo_open();
    $imageType = finfo_buffer($f, $data, FILEINFO_EXTENSION);
    
    // Normalize JPEG type
    if (explode("/", $imageType)[0] == "jpeg") { $imageType = "jpeg"; }

    // Validate image type
    if (!in_array($imageType, $allowed)) {
        return null; // Invalid image type
    }

    // Generate filename
    $filename = uniqid() . '-' . time() . '.' . $imageType;
    $dirSmallPath = $this->setUpPath($path, $feature);

    // Create directory if it doesn't exist
    if (!is_dir(public_path($dirSmallPath))) {
        @mkdir(public_path($dirSmallPath), 0755, true);
    }
    
    // Define full path
    $fullPath = $dirSmallPath . $filename;

    // Attempt to save the image
    try {
        Storage::disk('uploads')->put($fullPath, $data);
    } catch (\Exception $e) {
        Log::error('Image upload failed', ['exception' => $e->getMessage()]);
        return null; // Image upload failed
    }

    return $fullPath; // Return the path of the uploaded image
    }

    private function setUpPath($path = null, $feature = null): string
    {
        return 'uploads/' . $path . '/' . $feature . '/' . date('Y') . '/' . date('m') . '/' . date('d') . '/';
    }

    public function deletedImageByPath($path): bool
    {
        $existedFile = file_exists(public_path($path));
        if ($existedFile) {
            unlink(public_path($path));
        }
        return true;
    }

    /**
     * @throws ImageResizeException
     */
    public function resizeQualityFileImageSizeFromBase64($base64): string
    {
        // this function I want input base 64 and then resize it and return as base 64
        $path = $this->uploadImageBase64Format($base64, 'temp', 'resize');
        // Create ImageResize instance
        $image = new ImageResize(public_path($path));
        // Resize the image to 1000 x 1000
        $image->resizeToBestFit(1000, 1000);
        // Save the image
        $image->save($path);
        // get the file and convert to base64
        $data = Storage::disk('uploads')->get($path);
        // delete the file
        $this->deletedImageByPath($path);
        // return the base64
        return 'data:image/png;base64,' . base64_encode($data);
    }


    public function uploadResizeQualityFileImageSizeFromBase64($base64, $path, $feature): string
{
    // Process single base64 image input
    $imagePath = $this->uploadImageBase64Format($base64, $path, $feature);
    if (!$imagePath) {
        throw new \Exception('Image upload failed1234567.');
    }

    // Create ImageResize instance
    $image = new ImageResize(public_path($imagePath));
    // Resize the image to 1000 x 1000
    $image->resizeToBestFit(1000, 1000);
    // Save the resized image
    $image->save(public_path($imagePath)); // Use the original path to save the resized image

    return $imagePath; // Return the path of the resized image
}

}
