'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:8000/api/questions');
        // Handle data structure (array or wrapped in data)
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
  }, []);

  // Filter questions by search text and subject
  const filteredQuestions = questions.filter((q) => {
    const text = (q.question_text || '').toLowerCase();
    const subject = q.subject_name || 'Uncategorized';

    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  // Unique subjects list for filter dropdown
  const subjects = ['all', ...Array.from(new Set(questions.map((q) => q.subject_name || 'Uncategorized')))];

  // Toggle select/deselect question ID
  const toggleSelectQuestion = (id: number) => {
    setSelectedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  // Select or deselect all filtered questions
  const toggleSelectAll = () => {
    if (selectedQuestionIds.length === filteredQuestions.length) {
      setSelectedQuestionIds([]);
    } else {
      setSelectedQuestionIds(filteredQuestions.map(q => q.id));
    }
  };

  // Add selected questions to exam via API call
  const handleAddToExam = async () => {
    if (selectedQuestionIds.length === 0) {
      toast.error('Please select at least one question');
      return;
    }
    setIsAdding(true);
    try {
      await axios.post(`http://localhost:8000/api/exams/${examId}/questions`, {
        question_ids: selectedQuestionIds,
      });
      toast.success('Questions added to exam!');
      setSelectedQuestionIds([]);
    } catch (error) {
      toast.error('Failed to add questions');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Add Questions to Exam #{examId}</CardTitle>
        <div className="flex items-center space-x-2">
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="search"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center py-10">Loading questions...</p>
        ) : filteredQuestions.length === 0 ? (
          <p className="text-center py-10">No questions found.</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      checked={selectedQuestionIds.length === filteredQuestions.length}
                      onChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[80px]">Points</TableHead>
                </TableRow>
              </TableHeader>
             <TableBody>
  {filteredQuestions.map((q, i) => (
    <TableRow key={q.id}>
      <TableCell>
        <input
          type="checkbox"
          checked={selectedQuestionIds.includes(q.id)}
          onChange={() => toggleSelectQuestion(q.id)}
        />
      </TableCell>
      <TableCell>{i + 1}</TableCell>
      <TableCell>
        {q.question_text ? (
          q.question_text
        ) : q.question_image ? (
          <img
            src={
              q.question_image.startsWith('http')
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

            <Button
              onClick={handleAddToExam}
              disabled={isAdding}
              className="mt-4 w-full"
            >
              {isAdding ? 'Adding...' : 'Add Selected Questions to Exam'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
