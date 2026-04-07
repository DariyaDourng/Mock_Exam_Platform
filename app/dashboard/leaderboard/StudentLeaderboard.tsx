"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// Added more icons for the header
import { 
  Timer, 
  Calendar, 
  Calculator, 
  Atom, 
  FlaskConical, 
  BookOpen 
} from "lucide-react";
import { API_URL } from "@/config";

export default function StudentLeaderboard() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL + "/api/leaderboard");
        const data = response.data?.data ?? [];
        setCategories(data);

        if (data.length > 0) {
          setActiveTab(data[0].category_id.toString());
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper to assign icons to your specific subjects
  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("math")) return <Calculator className="h-4 w-4" />;
    if (lowerName.includes("physic")) return <Atom className="h-4 w-4" />;
    if (lowerName.includes("chemist")) return <FlaskConical className="h-4 w-4" />;
    return <BookOpen className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDuration = (duration: string) => {
    const [minStr, secStr] = duration.split(":");
    const min = parseInt(minStr);
    const sec = parseInt(secStr);
    const safeMin = isNaN(min) || min < 0 ? 0 : min;
    const safeSec = isNaN(sec) || sec < 0 ? 0 : sec;
    return `${safeMin}mn ${safeSec}s`;
  };

  const renderLeaderboardItem = (student: any, index: number) => {
    const rankNumber = index + 1;
    const displayScore = Number.isInteger(student.highest_score)
      ? student.highest_score.toString()
      : student.highest_score.toFixed(2);

    return (
      <div
        key={student.user_id || index}
        className="grid grid-cols-12 items-center gap-4 p-4 border-b hover:bg-gray-50 transition-colors"
      >
        <div className="col-span-1 flex justify-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              index === 0
                ? "bg-indigo-100 text-indigo-700"
                : index < 3
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {rankNumber}
          </div>
        </div>

        <div className="col-span-3 flex items-center gap-3">
          <span className="font-medium">{student.user_name}</span>
        </div>

        <div className="col-span-2 text-right text-indigo-600 font-bold">
          <div>{displayScore}%</div>
        </div>

        <div className="col-span-2 text-center">
          <div className="font-medium text-gray-600">{student.tests || 1}</div>
        </div>

        <div className="col-span-2 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
            <Timer className="h-3.5 w-3.5" />
            <span>{formatDuration(student.duration || "00:00")}</span>
          </div>
        </div>

        <div className="col-span-2 text-center">
          <div className="flex items-center justify-center gap-1 text-gray-500 text-sm">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(student.date || new Date().toISOString())}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* NEW HEADER DESIGN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">
            Leaderboard
          </h1>
          <p className="text-slate-500 mt-2">
            Recognizing the top academic performers across all subjects.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-slate-100 p-1.5 text-slate-500 w-full md:w-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.category_id}
                value={category.category_id.toString()}
                className="inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm"
              >
                {getCategoryIcon(category.category_name)}
                {category.category_name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* ORIGINAL CONTENT LOGIC */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {categories.map((category) => (
          <TabsContent
            value={category.category_id.toString()}
            key={category.category_id}
            className="mt-0 focus-visible:outline-none"
          >
            <Card className="shadow-xl border-none ring-1 ring-slate-200">
              <CardHeader className="pb-4 bg-slate-50/50 rounded-t-xl border-b mb-2">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-600 rounded-lg text-white">
                      {getCategoryIcon(category.category_name)}
                   </div>
                   <div>
                    <CardTitle className="text-xl text-slate-900">
                      {category.category_name} Rankings
                    </CardTitle>
                    <CardDescription className="text-slate-500 font-medium">
                      Ranked by highest score achieved
                    </CardDescription>
                   </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <p className="text-center text-gray-500 py-20 font-medium">
                    Fetching rankings...
                  </p>
                ) : category.leaderboard?.length > 0 ? (
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-12 bg-slate-50/80 p-4 border-b text-[11px] uppercase tracking-wider font-bold text-slate-500">
                      <div className="col-span-1 text-center">Rank</div>
                      <div className="col-span-3">Student Name</div>
                      <div className="col-span-2 text-right">Highest Score</div>
                      <div className="col-span-2 text-center">Total Tries</div>
                      <div className="col-span-2 text-center">Duration</div>
                      <div className="col-span-2 text-center">Last Attempt</div>
                    </div>

                    <div className="divide-y">
                      {category.leaderboard
                        .slice(0, 10)
                        .map((student: any, index: number) =>
                          renderLeaderboardItem(student, index),
                        )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-20 italic">
                    No records found for this category yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}