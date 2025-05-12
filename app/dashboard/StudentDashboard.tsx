"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  BarChart3,
  Trophy,
  Clock,
  TrendingUp,
  Calendar,
  Bell,
  Target,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  Star,
} from "lucide-react"

// Import chart components
import { Chart, ChartContainer } from "@/components/ui/chart"
import { Bar, Line, Pie } from "react-chartjs-2"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  ArcElement,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend)

export default function StudentDashboard() {
  const [timeRange, setTimeRange] = useState("month")

  // Mock data
  const recentTests = [
    { id: 1, name: "Math Fundamentals", score: 85, date: "2023-05-01", subject: "Math" },
    { id: 2, name: "Logic IQ Test", score: 78, date: "2023-04-28", subject: "Logic IQ" },
    { id: 3, name: "Advanced Mathematics", score: 72, date: "2023-04-15", subject: "Math" },
  ]

  const upcomingTests = [
    { id: 3, name: "Advanced Mathematics", duration: 60, difficulty: "Advanced", date: "2023-05-10" },
    { id: 4, name: "Critical Thinking", duration: 45, difficulty: "Intermediate", date: "2023-05-15" },
  ]

  const studyRecommendations = [
    { id: 1, topic: "Algebra Fundamentals", reason: "Based on your recent Math test scores", priority: "High" },
    { id: 2, topic: "Pattern Recognition", reason: "To improve Logic IQ performance", priority: "Medium" },
    { id: 3, topic: "Geometry Basics", reason: "Upcoming in Advanced Mathematics", priority: "Medium" },
  ]

  const upcomingEvents = [
    { id: 1, title: "Math Competition", date: "2023-05-20", type: "Competition" },
    { id: 2, title: "Logic Workshop", date: "2023-05-25", type: "Workshop" },
  ]

  const subjectProgress = [
    { subject: "Math", progress: 68, testsCompleted: 8, totalTests: 12 },
    { subject: "Logic IQ", progress: 75, testsCompleted: 6, totalTests: 8 },
  ]

  const notifications = [
    { id: 1, title: "New test available", message: "Advanced Mathematics test is now available", type: "info" },
    { id: 2, title: "Test score", message: "You scored 85% on Math Fundamentals", type: "success" },
    { id: 3, title: "Upcoming deadline", message: "Logic Workshop registration closes tomorrow", type: "warning" },
  ]

  const learningGoals = [
    { id: 1, title: "Complete 5 Math tests", progress: 80, dueDate: "2023-05-30" },
    { id: 2, title: "Achieve 85% average in Logic IQ", progress: 60, dueDate: "2023-06-15" },
  ]

  const weakAreas = [
    { id: 1, topic: "Quadratic Equations", subject: "Math", accuracy: 45 },
    { id: 2, topic: "Spatial Reasoning", subject: "Logic IQ", accuracy: 52 },
  ]

  // Chart data
  const performanceData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Math",
        data: [65, 70, 68, 72, 78, 85],
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Logic IQ",
        data: [60, 65, 70, 75, 78, 82],
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const subjectDistributionData = {
    labels: ["Math", "Logic IQ"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["rgba(99, 102, 241, 0.7)", "rgba(14, 165, 233, 0.7)"],
        borderColor: ["rgb(99, 102, 241)", "rgb(14, 165, 233)"],
        borderWidth: 1,
      },
    ],
  }

  const strengthsData = {
    labels: ["Algebra", "Geometry", "Statistics", "Pattern Recognition", "Logical Reasoning"],
    datasets: [
      {
        label: "Accuracy (%)",
        data: [85, 65, 78, 90, 72],
        backgroundColor: "rgba(99, 102, 241, 0.7)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High Priority</Badge>
      case "Medium":
        return <Badge variant="secondary">Medium Priority</Badge>
      case "Low":
        return <Badge variant="outline">Low Priority</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Beginner</Badge>
      case "Intermediate":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Intermediate</Badge>
        )
      case "Advanced":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Advanced</Badge>
      default:
        return <Badge variant="secondary">{difficulty}</Badge>
    }
  }

  const getEventBadge = (type: string) => {
    switch (type) {
      case "Competition":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Competition</Badge>
        )
      case "Workshop":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Workshop</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    
      <div className="space-y-6">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, John! Here's your learning progress.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 days</SelectItem>
                <SelectItem value="month">Last 30 days</SelectItem>
                <SelectItem value="quarter">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
              <Link href="/dashboard/tests">
                <FileText className="mr-2 h-4 w-4" />
                Take a Test
              </Link>
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {/* <div className="space-y-2">
          {notifications.map((notification) => (
            <Alert key={notification.id} variant={notification.type === "warning" ? "destructive" : "default"}>
              <div className="flex items-start">
                {getNotificationIcon(notification.type)}
                <div className="ml-2">
                  <AlertTitle>{notification.title}</AlertTitle>
                  <AlertDescription>{notification.message}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div> */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span>+2 from last month</span>
              </div>
              <Progress value={75} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span>+5% from last month</span>
              </div>
              <Progress value={76} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rank</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#15</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span>+3 positions from last month</span>
              </div>
              <Progress value={85} className="mt-2 h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Study Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24h</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span>+2h from last month</span>
              </div>
              <Progress value={60} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Your test scores over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer>
                  <Chart>
                    <Line
                      data={performanceData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: false,
                            min: 50,
                            max: 100,
                          },
                        },
                        plugins: {
                          legend: {
                            display: true,
                            position: "top",
                          },
                          tooltip: {
                            mode: "index",
                            intersect: false,
                          },
                        },
                      }}
                    />
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>Track your progress towards goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {learningGoals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-medium">{goal.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Due {new Date(goal.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={goal.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  <Target className="mr-2 h-4 w-4" />
                  Set New Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Subject Distribution</CardTitle>
              <CardDescription>Time spent on each subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center">
                <ChartContainer className="max-w-[240px]">
                  <Chart>
                    <Pie
                      data={subjectDistributionData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: "right",
                          },
                        },
                      }}
                    />
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Strengths</CardTitle>
              <CardDescription>Topics where you excel</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ChartContainer>
                  <Chart>
                    <Bar
                      data={strengthsData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    />
                  </Chart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Areas to Improve</CardTitle>
              <CardDescription>Topics that need more attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weakAreas.map((area) => (
                  <div key={area.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{area.topic}</span>
                      </div>
                      <Badge variant="outline">{area.subject}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={area.accuracy} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-red-500">{area.accuracy}%</span>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full">
                      View Resources
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tests</CardTitle>
              <CardDescription>Tests available to take</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{test.name}</span>
                        {getDifficultyBadge(test.difficulty)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {test.duration} min • Due {new Date(test.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                      <Link href={`/dashboard/tests/${test.id}`}>Start</Link>
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/tests">
                    View All Tests
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTests.map((test) => (
                  <div key={test.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{test.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {test.subject} • {new Date(test.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      className={
                        test.score >= 80
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : test.score >= 70
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }
                    >
                      {test.score}%
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/scores">
                    View All Results
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommendations">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recommendations">Study Recommendations</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Study Recommendations</CardTitle>
                <CardDescription>Based on your performance and upcoming tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyRecommendations.map((rec) => (
                    <div key={rec.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Lightbulb className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{rec.topic}</p>
                            {getPriorityBadge(rec.priority)}
                          </div>
                          <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        </div>
                      </div>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Study Now</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Competitions, workshops, and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{event.title}</p>
                            {getEventBadge(event.type)}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString(undefined, {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Add to Calendar</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/calendar">View Full Calendar</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with the highest scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Trophy className="h-4 w-4 text-primary" />
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Alex Johnson" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Alex Johnson</p>
                        <p className="text-xs text-muted-foreground">Math</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">98%</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Star className="h-4 w-4 text-primary" />
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="Emma Davis" />
                        <AvatarFallback>ED</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Emma Davis</p>
                        <p className="text-xs text-muted-foreground">Logic IQ</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">96%</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-medium">3</span>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="James Wilson" />
                        <AvatarFallback>JW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">James Wilson</p>
                        <p className="text-xs text-muted-foreground">Math</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">94%</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <span className="text-xs font-medium">15</span>
                      </div>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="You" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">You</p>
                        <p className="text-xs text-muted-foreground">Math & Logic IQ</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">76%</Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/leaderboard">View Full Leaderboard</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

  )
}
