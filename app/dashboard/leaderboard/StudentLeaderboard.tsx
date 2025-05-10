import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal } from "lucide-react"

export default function StudentLeaderboard() {
  // Mock data
  const mathLeaderboard = [
    { id: 1, name: "Alex Johnson", score: 98, tests: 15, avatar: "" },
    { id: 2, name: "Maria Garcia", score: 95, tests: 12, avatar: "" },
    { id: 3, name: "James Wilson", score: 92, tests: 14, avatar: "" },
    { id: 4, name: "Sarah Lee", score: 90, tests: 10, avatar: "" },
    { id: 5, name: "David Chen", score: 89, tests: 13, avatar: "" },
    { id: 6, name: "Emma Davis", score: 87, tests: 11, avatar: "" },
    { id: 7, name: "Michael Brown", score: 85, tests: 9, avatar: "" },
    { id: 8, name: "Sophia Martinez", score: 84, tests: 12, avatar: "" },
    { id: 9, name: "Daniel Taylor", score: 82, tests: 10, avatar: "" },
    { id: 10, name: "Olivia Anderson", score: 80, tests: 8, avatar: "" },
  ]

  const logicLeaderboard = [
    { id: 1, name: "Emma Davis", score: 96, tests: 14, avatar: "" },
    { id: 2, name: "James Wilson", score: 94, tests: 13, avatar: "" },
    { id: 3, name: "Maria Garcia", score: 93, tests: 15, avatar: "" },
    { id: 4, name: "David Chen", score: 91, tests: 12, avatar: "" },
    { id: 5, name: "Alex Johnson", score: 90, tests: 11, avatar: "" },
    { id: 6, name: "Sarah Lee", score: 88, tests: 10, avatar: "" },
    { id: 7, name: "Daniel Taylor", score: 86, tests: 9, avatar: "" },
    { id: 8, name: "Sophia Martinez", score: 85, tests: 13, avatar: "" },
    { id: 9, name: "Michael Brown", score: 83, tests: 8, avatar: "" },
    { id: 10, name: "Olivia Anderson", score: 81, tests: 10, avatar: "" },
  ]

  const renderLeaderboardItem = (student: any, index: number) => {
    const isTopThree = index < 3

    return (
      <div
        key={student.id}
        className={`flex items-center justify-between rounded-lg p-3 ${isTopThree ? "bg-indigo-50" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            {index === 0 ? (
              <Trophy className="h-4 w-4 text-indigo-600" />
            ) : isTopThree ? (
              <Medal className="h-4 w-4 text-indigo-600" />
            ) : (
              <span className="text-sm font-medium">{index + 1}</span>
            )}
          </div>
          <Avatar className="h-8 w-8">
            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-xs text-muted-foreground">{student.tests} tests taken</p>
          </div>
        </div>
        <Badge variant={index === 0 ? "default" : "outline"} className="ml-auto text-white bg-indigo-600">
          {student.score}%
        </Badge>
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank against other students</p>
        </div>

        <Tabs defaultValue="math">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="math"  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-black">Math</TabsTrigger>
            <TabsTrigger value="logic"  className="data-[state=active]:bg-indigo-50 data-[state=active]:text-black" >Logic IQ</TabsTrigger>
          </TabsList>

          <TabsContent value="math" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Math Leaderboard</CardTitle>
                <CardDescription>Top performers in Mathematics tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mathLeaderboard.map((student, index) => renderLeaderboardItem(student, index))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logic" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Logic IQ Leaderboard</CardTitle>
                <CardDescription>Top performers in Logic IQ tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {logicLeaderboard.map((student, index) => renderLeaderboardItem(student, index))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
