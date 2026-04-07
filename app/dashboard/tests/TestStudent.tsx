"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Clock, FileText, ChevronRight, Search, LayoutGrid, Star } from "lucide-react"
import { API_URL } from "@/config"

interface Test {
  id: number
  name: string
  description: string
  duration: number
  total_questions: number
  difficulty: string
  category: string
}

interface Category {
  id: number
  name: string
}

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [testsRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/api/exams`),
          axios.get(`${API_URL}/api/categories`)
        ])
        setTests(testsRes.data.data || testsRes.data || [])
        setCategories(catRes.data.data || catRes.data || [])
      } catch (err: any) {
        setError(err.message || "Failed to load tests")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || test.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600"></div>
    </div>
  )

  if (error) return <p className="text-red-600 p-8 text-center font-medium">Error: {error}</p>

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* --- Header Section (Kept Original Scale) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Available Tests</h1>
          <p className="text-muted-foreground">Choose a test to start practicing</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tests..." 
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- Category Tabs --- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b">
        <Button
          variant={selectedCategory === "All" ? "default" : "ghost"}
          size="sm"
          className="rounded-full px-4"
          onClick={() => setSelectedCategory("All")}
        >
          All Tests
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.name}
            variant={selectedCategory === cat.name ? "default" : "ghost"}
            size="sm"
            className="rounded-full px-4 whitespace-nowrap"
            onClick={() => setSelectedCategory(cat.name)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* --- Redesigned Exam Grid --- */}
      {filteredTests.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTests.map((test) => (
            <Card 
              key={test.id} 
              className="group flex flex-col border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-[1.25rem] bg-white dark:bg-slate-950 overflow-hidden"
            >
              <CardHeader className="pb-3 px-6 pt-6">
                <CardTitle className="text-sm font-bold group-hover:text-indigo-600 transition-colors uppercase line-clamp-1">
                  {test.name}
                </CardTitle>
                
                <CardDescription className="line-clamp-2 text-sm leading-relaxed mt-2 min-h-[40px]">
                  {test.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 py-2 flex-1">
                {/* Stats Inset Section */}
                <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-center gap-1.5 text-indigo-500">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold tracking-widest opacity-70">Questions</span>
                    </div>
                    <p className="font-black">{test.total_questions}</p>
                  </div>
                  
                  <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800 mx-2" />
                  
                  <div className="flex flex-col items-center gap-1 flex-1">
                    <div className="flex items-center gap-1.5 text-indigo-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold tracking-widest opacity-70">Duration</span>
                    </div>
                    <p className="font-black">
                      {test.duration}<span className="text-xs ml-0.5 font-bold opacity-40">m</span>
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-2">
                <Button 
                  className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none group/btn transition-all active:scale-[0.97]" 
                  asChild
                >
                  <Link href={`/dashboard/tests/${test.id}`} className="flex items-center justify-center gap-2">
                    Start Test
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl">
          <p className="text-muted-foreground">No tests found matching your filters.</p>
        </div>
      )}
    </div>
  )
}