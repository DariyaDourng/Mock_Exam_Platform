import StudentLeaderboard from '@/app/dashboard/leaderboard/StudentLeaderboard';

export default function AdminLeaderboardPage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <StudentLeaderboard />
    </main>
  );
}