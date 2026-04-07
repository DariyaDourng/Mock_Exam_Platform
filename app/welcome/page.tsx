"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, CheckCircle, ChevronRight, FileText, Lightbulb, Target, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Header from "@/components/header/Header"

export default function WelcomePage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isNewUser, setIsNewUser] = useState(true)

  // Simulate checking if user is new or returning
  useEffect(() => {
    // This would typically come from your auth context or API
    // For demo purposes, we're just using a random value
    setIsNewUser(Math.random() > 0.5)

    // Animate progress bar
    const timer = setTimeout(() => setProgress(100), 500)
    return () => clearTimeout(timer)
  }, [])

  // Mock data
  const recommendedExams = [
    { id: 1, title: "Math Fundamentals", questions: 25, duration: "30 min", category: "Mathematics" },
    { id: 2, title: "Logic IQ Test", questions: 20, duration: "25 min", category: "Logic" },
  ]

  const onboardingSteps = [
    {
      id: 1,
      title: "Complete your profile",
      description: "Add your educational background and interests",
      completed: true,
    },
    {
      id: 2,
      title: "Take a placement test",
      description: "Help us understand your current knowledge level",
      completed: false,
    },
    { id: 3, title: "Set your learning goals", description: "Define what you want to achieve", completed: false },
    { id: 4, title: "Explore available exams", description: "Browse through our exam catalog", completed: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 py-16">
      <Header />

      <main className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl space-y-8"
        >
          {/* Welcome message */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
            >
              <CheckCircle className="h-10 w-10 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold sm:text-4xl">{isNewUser ? "Welcome to MockExam!" : "Welcome back!"}</h1>
            <p className="mt-2 text-muted-foreground">
              {isNewUser
                ? "Your account has been successfully created. Let's get you started on your learning journey."
                : "You've successfully logged in. Ready to continue your learning journey?"}
            </p>
            <div className="mt-4">
              <Progress value={progress} className="h-2 w-full max-w-md mx-auto" />
            </div>
          </div>

          {isNewUser ? (
            /* New user onboarding */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Onboarding</CardTitle>
                  <CardDescription>Follow these steps to get the most out of MockExam</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {onboardingSteps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                        className="flex items-start space-x-4 rounded-lg border p-4"
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            step.completed ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.completed ? <CheckCircle className="h-4 w-4" /> : <span>{step.id}</span>}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        <Button variant={step.completed ? "outline" : "default"} size="sm" disabled={step.completed}>
                          {step.completed ? "Completed" : "Start"}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/dashboard">
                      Continue to Dashboard
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Set Your Learning Goals</CardTitle>
                    <CardDescription>Define what you want to achieve</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Track your progress</p>
                        <p className="text-sm text-muted-foreground">Set goals and monitor your improvement</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Earn achievements</p>
                        <p className="text-sm text-muted-foreground">Get rewarded for your hard work</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Set Goals
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Learning Resources</CardTitle>
                    <CardDescription>Helpful materials to get started</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Study guides</p>
                        <p className="text-sm text-muted-foreground">Comprehensive materials for each category</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Tips and strategies</p>
                        <p className="text-sm text-muted-foreground">Learn how to approach different question types</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Browse Resources
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          ) : (
            /* Returning user welcome back */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Continue Your Learning</CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">Advanced Mathematics</h3>
                            <p className="text-sm text-muted-foreground">You completed 60% of this exam</p>
                          </div>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Resume</Button>
                      </div>
                      <div className="mt-4">
                        <Progress value={60} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                  <CardDescription>Based on your previous activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedExams.map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <h3 className="font-medium">{exam.title}</h3>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{exam.questions} questions</span>
                            <span>•</span>
                            <span>{exam.duration}</span>
                            <span>•</span>
                            <span>{exam.category}</span>
                          </div>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Start</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/tests">
                      View All Exams
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <div className="flex justify-center">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
