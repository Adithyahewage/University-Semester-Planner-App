import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Trash2, Plus, BookOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Course {
  id: string;
  name: string;
  code: string;
  credits: string;
  professor: string;
  contactInfo: string;
}

export default function CourseTracker() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('courses');
    if (saved) {
      setCourses(JSON.parse(saved));
    } else {
      // Add empty course for demo
      setCourses([{
        id: '1',
        name: '',
        code: '',
        credits: '',
        professor: '',
        contactInfo: ''
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('courses', JSON.stringify(courses));
  }, [courses]);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: '',
      code: '',
      credits: '',
      professor: '',
      contactInfo: ''
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const removeCourse = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  };

  const totalCredits = courses.reduce((sum, course) => {
    const credits = parseInt(course.credits) || 0;
    return sum + credits;
  }, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Course Tracker</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BookOpen className="mr-2 text-primary" size={20} />
            <h3>My Courses</h3>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Total Credits: <span className="text-primary">{totalCredits}</span>
            </div>
            <Button onClick={addCourse} size="sm" variant="outline">
              <Plus size={16} className="mr-1" />
              Add Course
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Course Name</TableHead>
                <TableHead>Course Code</TableHead>
                <TableHead className="w-20">Credits</TableHead>
                <TableHead>Professor</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course, index) => (
                <TableRow key={course.id} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}>
                  <TableCell>
                    <Input
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      placeholder="e.g., Calculus I"
                      className="border-0 bg-transparent p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={course.code}
                      onChange={(e) => updateCourse(course.id, 'code', e.target.value)}
                      placeholder="e.g., MATH 101"
                      className="border-0 bg-transparent p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={course.credits}
                      onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                      placeholder="3"
                      type="number"
                      className="border-0 bg-transparent p-1 w-16"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={course.professor}
                      onChange={(e) => updateCourse(course.id, 'professor', e.target.value)}
                      placeholder="Dr. Smith"
                      className="border-0 bg-transparent p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={course.contactInfo}
                      onChange={(e) => updateCourse(course.id, 'contactInfo', e.target.value)}
                      placeholder="email@university.edu"
                      className="border-0 bg-transparent p-1"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => removeCourse(course.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
            <p>No courses added yet. Click "Add Course" to get started!</p>
          </div>
        )}
      </Card>
    </div>
  );
}