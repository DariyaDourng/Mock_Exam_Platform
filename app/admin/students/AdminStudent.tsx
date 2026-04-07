'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import Next.js router
import { MoreHorizontal, Search } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { API_URL } from '@/config';

interface Student {
  id: number;
  name: string;
  email: string;
  gender?: string;
  is_active: boolean | 0 | 1;
  school?: {
    id: number;
    name: string;
  };
}

export default function AdminStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await axios.get(API_URL+'/api/users/students');
        setStudents(res.data.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch students');
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const getStatusBadge = (is_active: boolean | 0 | 1) => {
    return is_active ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        Active
      </Badge>
    ) : (
      <Badge variant="outline" className="text-gray-500 border-gray-300">
        Inactive
      </Badge>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Students</h1>
          <p className="text-muted-foreground">View and manage student accounts</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <CardTitle>All Students</CardTitle>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search students..." className="w-[250px] pl-8" />
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
                <TableHead className='font-bold text-black'>Name</TableHead>
                <TableHead className='font-bold text-black'>Email</TableHead>
                <TableHead className='font-bold text-black'>Gender</TableHead>
                <TableHead className='font-bold text-black'>School</TableHead>
                <TableHead className='font-bold text-black'>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => (
                <TableRow key={student.id ?? `student-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 text-white font-bold">
                        <AvatarImage src="/placeholder.svg" alt={student.name}/>
                        <AvatarFallback className='bg-indigo-500'>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.gender ?? '-'}</TableCell>
                  <TableCell>{student.school?.name ?? 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(student.is_active)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/students/${student.id}`)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Exam History</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          {student.is_active ? 'Deactivate Account' : 'Activate Account'}
                        </DropdownMenuItem>
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
  );
}
