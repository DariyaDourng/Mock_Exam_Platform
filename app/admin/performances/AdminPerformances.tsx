
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function AdminAnalyticsPage() {
  return (
    <div >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">Monitor student performance and test statistics</p>
          </div>
          <Select defaultValue="30days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border border-indigo-600 bg-indigo-50 ">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tests Taken</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="border border-green-600 bg-green-50 ">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">+3% from last month</p>
            </CardContent>
          </Card>
          <Card className="border border-red-600 bg-red-50 ">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">82%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
          <Card className="border border-yellow-600 bg-yellow-50 ">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+24 from last month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance">
          <TabsList className="bg-muted">
            <TabsTrigger value="performance" >Performance</TabsTrigger>
            <TabsTrigger value="subjects" >Subjects</TabsTrigger>
            <TabsTrigger value="demographics" >Demographics</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Trends</CardTitle>
                <CardDescription>Average test scores over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <LineChart className="h-5 w-5" />
                  <span>Performance trend chart visualization would appear here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subjects" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Average scores by subject</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BarChart className="h-5 w-5" />
                  <span>Subject performance chart visualization would appear here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demographics" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Demographics</CardTitle>
                <CardDescription>Breakdown of student population</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <PieChart className="h-5 w-5" />
                  <span>Demographics chart visualization would appear here</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Most Challenging Questions</CardTitle>
              <CardDescription>Questions with the lowest success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">What is the next number in the sequence: 2, 4, 8, 16, ...?</p>
                  <p className="font-medium text-red-500">42% correct</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">If a = 5 and b = 3, what is the value of a² - b²?</p>
                  <p className="font-medium text-red-500">48% correct</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Solve for x: 3x + 7 = 22</p>
                  <p className="font-medium text-yellow-500">56% correct</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Most Popular Tests</CardTitle>
              <CardDescription>Tests with the highest completion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Math Fundamentals</p>
                  <p className="font-medium">245 completions</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Logic IQ Test</p>
                  <p className="font-medium">198 completions</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Critical Thinking</p>
                  <p className="font-medium">156 completions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
