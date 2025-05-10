import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, FileText, Star } from "lucide-react"

export default function TestsPage() {
  // Mock data
  const tests = [
    {
      id: 1,
      name: "Math Fundamentals",
      description: "Basic arithmetic, algebra, and geometry concepts",
      duration: 45,
      questions: 30,
      difficulty: "Beginner",
      subject: "Math",
    },
    {
      id: 2,
      name: "Logic IQ Test",
      description: "Pattern recognition and logical reasoning problems",
      duration: 30,
      questions: 25,
      difficulty: "Intermediate",
      subject: "Logic IQ",
    },
    {
      id: 3,
      name: "Advanced Mathematics",
      description: "Calculus, statistics, and advanced algebra problems",
      duration: 60,
      questions: 40,
      difficulty: "Advanced",
      subject: "Math",
    },
    {
      id: 4,
      name: "Critical Thinking",
      description: "Analytical reasoning and problem-solving scenarios",
      duration: 45,
      questions: 35,
      difficulty: "Intermediate",
      subject: "Logic IQ",
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Available Tests</h1>
            <p className="text-muted-foreground">Choose a test to start practicing</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Sort
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => (
            <Card key={test.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>{test.name}</CardTitle>
                  <Badge variant="outline" className={getDifficultyColor(test.difficulty)}>
                    {test.difficulty}
                  </Badge>
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center text-sm">
                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{test.questions} questions</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{test.duration} minutes</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Star className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{test.subject}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
                  <Link href={`/dashboard/tests/${test.id}`}>Start Test</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
