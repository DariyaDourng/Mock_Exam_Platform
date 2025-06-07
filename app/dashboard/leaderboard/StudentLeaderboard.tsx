'use client'

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Medal } from "lucide-react"
import axios from "axios"

export default function StudentLeaderboard() {
  const [subjects, setSubjects] = useState<any[]>([])  // All available subjects
  const [leaderboardData, setLeaderboardData] = useState<any>({})
  const [userExams, setUserExams] = useState<any[]>([])  // User attempted subjects
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch all subjects from the backend
  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/subjects")
      setSubjects(response.data.data)  // Assuming the response structure has the `data` key with subjects
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  // Fetch leaderboard data for the selected subject
  const fetchLeaderboardData = async (subjectId: string) => {
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:8000/api/leaderboard/${subjectId}`)
      setLeaderboardData((prevData: any) => ({
        ...prevData,
        [subjectId]: response.data.data,  // Store leaderboard data for each subject
      }))
    } catch (error) {
      console.error("Error fetching leaderboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch the user's attempted subjects from the backend
  const fetchUserExams = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user-exams")  // Adjust the API if necessary
      setUserExams(response.data.data)  // Assuming the response contains a list of exam attempts
    } catch (error) {
      console.error("Error fetching user exams:", error)
    }
  }

  // Fetch subjects and user exams on component mount
  useEffect(() => {
    fetchSubjects()
    fetchUserExams()
  }, [])

  // Handle subject change (tab change)
  const handleSubjectChange = (subjectId: string) => {
    if (!leaderboardData[subjectId]) {
      fetchLeaderboardData(subjectId)  // Fetch leaderboard data for selected subject
    }
  }

  // Filter subjects that the user has attempted
  const filteredSubjects = subjects.filter((subject) =>
    userExams.some((exam) => exam.subject_id === subject.id)  // Filter subjects based on user exam attempts
  )

  // Render leaderboard item
  const renderLeaderboardItem = (student: any, index: number) => {
    const isTopThree = index < 3

    return (
      <div
        key={student.user_id || index}  // Ensure a unique key, fallback to index if id is missing
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
            <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.user_name} />
            <AvatarFallback>{student.user_name?.charAt(0) || "?"}</AvatarFallback>  {/* Added null check for name */}
          </Avatar>
          <div>
            <p className="font-medium">{student.user_name}</p> {/* Use user_name instead of name */}
            <p className="text-xs text-muted-foreground">{student.tests} tests taken</p>
          </div>
        </div>
        <Badge variant={index === 0 ? "default" : "outline"} className="ml-auto text-white bg-indigo-600">
          {student.highest_score}
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

        <Tabs defaultValue="math" onValueChange={handleSubjectChange}>
          <TabsList className="grid w-full grid-cols-2">
            {filteredSubjects.map((subject) => (
              <TabsTrigger value={subject.id.toString()} key={subject.id} className="data-[state=active]:bg-indigo-50 data-[state=active]:text-black">
                {subject.subject_name}
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredSubjects.map((subject) => (
            <TabsContent value={subject.id.toString()} key={subject.id} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{subject.subject_name} Leaderboard</CardTitle>
                  <CardDescription>Top performers in {subject.subject_name} tests</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div>Loading...</div>
                  ) : (
                    <div className="space-y-2">
                      {leaderboardData[subject.id]?.map((student: any, index: number) =>
                        renderLeaderboardItem(student, index)
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
