"use client"

import { useState, useEffect } from "react"
import axios from "axios"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Timer,
  Calendar,
} from "lucide-react"

export default function StudentLeaderboard() {
  const [subjects, setSubjects] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:8000/api/leaderboard")
        const data = response.data?.data ?? []
        setSubjects(data)

        if (data.length > 0) {
          setActiveTab(data[0].subject_id.toString())
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatDuration = (duration: string) => {
    const [min, sec] = duration.split(":")
    return `${parseInt(min)}mn ${parseInt(sec)}s`
  }

  const renderLeaderboardItem = (student: any, index: number) => {
    const rankNumber = index + 1

    // Check if the highest score is a whole number or has decimal places
    const displayScore = Number.isInteger(student.highest_score)
      ? student.highest_score.toString()  // Display without decimal if integer
      : student.highest_score.toFixed(2);  // Display with 2 decimal places if it's a float

    return (
      <div
        key={student.user_id || index}
        className="grid grid-cols-12 items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
      >
        <div className="col-span-1 flex justify-center">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
            index === 0 ? "bg-indigo-100 text-indigo-700" : 
            index < 3 ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
          }`}>
            {rankNumber}
          </div>
        </div>

        <div className="col-span-3 flex items-center gap-3">
          <span className="font-medium">{student.user_name}</span>
        </div>

        <div className="col-span-2 text-right">
          {/* Display the highest_score on a 100-point scale, conditionally formatted */}
          <div>{displayScore}%</div>  {/* Display score with or without decimals */}
        </div>

        <div className="col-span-2 text-center">
          <div className="font-medium">{student.tests || 1}</div>
        </div>

        <div className="col-span-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <Timer className="h-4 w-4" />
            <span>{formatDuration(student.duration || "00:00")}</span>
          </div>
        </div>

        <div className="col-span-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(student.date || new Date().toISOString())}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className={`grid grid-cols-${subjects.length || 1} w-full`}>
          {subjects.map(subject => (
            <TabsTrigger
              key={subject.subject_id}
              value={subject.subject_id.toString()}
              className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 font-medium"
            >
              {subject.subject_name}
            </TabsTrigger>
          ))}
        </TabsList>

        {subjects.map(subject => (
          <TabsContent value={subject.subject_id.toString()} key={subject.subject_id} className="mt-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">{subject.subject_name} Leaderboard</CardTitle>
                <CardDescription className="text-gray-600">
                  Top performers in {subject.subject_name} tests - ranked by highest score
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center text-gray-500 py-8">Loading leaderboard data...</p>
                ) : subject.leaderboard?.length > 0 ? (
                  <div className="overflow-hidden rounded-lg border">
                    <div className="grid grid-cols-12 bg-gray-50 p-4 border-b">
                      <div className="col-span-1 text-center text-sm font-medium text-gray-500">Rank</div>
                      <div className="col-span-3 text-sm font-medium text-gray-500">Student Name</div>
                      <div className="col-span-2 text-right text-sm font-medium text-gray-500">Score</div>
                      <div className="col-span-2 text-center text-sm font-medium text-gray-500">Attempts</div>
                      <div className="col-span-2 text-center text-sm font-medium text-gray-500">Duration</div>
                      <div className="col-span-2 text-center text-sm font-medium text-gray-500">Test Date</div>
                    </div>

                    <div className="divide-y">
                      {subject.leaderboard
                        .slice(0, 10)
                        .map((student: any, index: number) => renderLeaderboardItem(student, index))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No leaderboard data available for this subject.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
