'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Question {
  id: number;
  question_text: string | null;
  question_image?: string | null;
  subject_name?: string;
  type?: string;
  points?: number;
}

interface AddQuestionsToExamProps {
  examId: number;
}

export default function AddQuestionsToExam({ examId }: AddQuestionsToExamProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        // Fetch questions specifically for this exam by using the examId in the URL
        const res = await axios.get(`http://localhost:8000/api/exams/${examId}/questions`);
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setQuestions(data);
      } catch (error) {
        toast.error('Failed to load questions');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [examId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions for Exam #{examId}</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center py-10">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-center py-10">No questions found for this exam.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((q, i) => (
                  <TableRow key={q.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      {q.question_text ? (
                        q.question_text
                      ) : q.question_image ? (
                        <img
                          src={
                            q.question_image && q.question_image.startsWith('http')
                              ? q.question_image
                              : `http://localhost:8000${q.question_image}`
                          }
                          alt={`Question ${i + 1} Image`}
                          className="max-h-24 max-w-full object-contain"
                        />
                      ) : (
                        '[No Question Content]'
                      )}
                    </TableCell>
                    <TableCell>{q.subject_name || 'Uncategorized'}</TableCell>
                    <TableCell className="capitalize">{q.type?.replace('-', ' ')}</TableCell>
                    <TableCell>{q.points || 1}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
}
