'use client';
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, MoreHorizontal, Plus, Search } from "lucide-react"

export default function AdminTestsPage() {
  // Mock data
  const tests = [
    {
      id: 1,
      name: "Math Fundamentals",
      category: "Math",
      questions: 30,
      duration: 45,
      createdAt: "2023-05-01",
      status: "active",
    },
    {
      id: 2,
      name: "Logic IQ Test",
      category: "Logic IQ",
      questions: 25,
      duration: 30,
      createdAt: "2023-04-28",
      status: "active",
    },
    {
      id: 3,
      name: "Advanced Mathematics",
      category: "Math",
      questions: 40,
      duration: 60,
      createdAt: "2023-04-15",
      status: "draft",
    },
    {
      id: 4,
      name: "Critical Thinking",
      category: "Logic IQ",
      questions: 35,
      duration: 45,
      createdAt: "2023-04-10",
      status: "active",
    },
    {
      id: 5,
      name: "Algebra Basics",
      category: "Math",
      questions: 25,
      duration: 40,
      createdAt: "2023-04-05",
      status: "active",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <DashboardLayout userRole="admin" userName="Admin">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Tests</h1>
            <p className="text-muted-foreground">Create, edit, and manage your tests</p>
          </div>
          <Button asChild>
            <Link href="/admin/tests/new">
              <Plus className="mr-2 h-4 w-4" /> New Test
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <CardTitle>All Tests</CardTitle>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search tests..." className="w-[250px] pl-8" />
              </div>
              <Button variant="outline" size="sm">
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Questions</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tests.map((test) => (
                  <TableRow key={test.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{test.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{test.category}</TableCell>
                    <TableCell>{test.questions}</TableCell>
                    <TableCell>{test.duration} min</TableCell>
                    <TableCell>{new Date(test.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(test.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/tests/${test.id}`}>Edit</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/tests/${test.id}/questions`}>Manage Questions</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/tests/${test.id}/results`}>View Results</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
