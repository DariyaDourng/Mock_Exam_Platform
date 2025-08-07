'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/config';

interface ImportQuestionsProps {
  examId: number;
  onImportSuccess: () => void;
}

export default function ImportQuestions({ examId, onImportSuccess }: ImportQuestionsProps) {
  const [questionBank, setQuestionBank] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);

  // Fetch all questions from question bank
  const fetchQuestionBank = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL+'/api/questions');
      const data = Array.isArray(res.data) ? res.data : res.data.data || [];
      setQuestionBank(data);
    } catch (error) {
      toast.error('Failed to load question bank');
      setQuestionBank([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestionBank();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((qid) => qid !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
    if (selectedIds.length === 0) {
      toast.error('Select at least one question to import');
      return;
    }
    setImporting(true);
    try {
      await axios.post(API_URL+`/api/exams/${examId}/questions`, {
        question_ids: selectedIds,
      });
      toast.success('Questions imported successfully!');
      setSelectedIds([]);
      onImportSuccess();
    } catch (error) {
      toast.error('Failed to import questions');
    } finally {
      setImporting(false);
    }
  };

  if (loading) return <p>Loading question bank...</p>;

  if (questionBank.length === 0)
    return <p>No questions available in the question bank.</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Questions to Exam #{examId}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questionBank.map((q) => (
              <TableRow key={q.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(q.id)}
                    onChange={() => toggleSelect(q.id)}
                  />
                </TableCell>
                <TableCell>{q.id}</TableCell>
                <TableCell>{q.question_text || '[Image Question]'}</TableCell>
                <TableCell>{q.type || 'unknown'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button
          className="mt-4"
          onClick={handleImport}
          disabled={importing}
        >
          {importing ? 'Importing...' : 'Import Selected Questions'}
        </Button>
      </CardContent>
    </Card>
  );
}
