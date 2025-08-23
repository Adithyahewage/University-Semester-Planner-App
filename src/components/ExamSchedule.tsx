import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Trash2, Plus, GraduationCap, Clock, AlertTriangle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
  weight: string;
  notes: string;
}

export default function ExamSchedule() {
  const [exams, setExams] = useState<Exam[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('exams');
    if (saved) {
      setExams(JSON.parse(saved));
    } else {
      // Add empty exam for demo
      setExams([{
        id: '1',
        subject: '',
        date: '',
        time: '',
        weight: '',
        notes: ''
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('exams', JSON.stringify(exams));
  }, [exams]);

  const addExam = () => {
    const newExam: Exam = {
      id: Date.now().toString(),
      subject: '',
      date: '',
      time: '',
      weight: '',
      notes: ''
    };
    setExams(prev => [...prev, newExam]);
  };

  const updateExam = (id: string, field: keyof Exam, value: string) => {
    setExams(prev => prev.map(exam => 
      exam.id === id ? { ...exam, [field]: value } : exam
    ));
  };

  const removeExam = (id: string) => {
    setExams(prev => prev.filter(exam => exam.id !== id));
  };

  const getDaysUntilExam = (date: string) => {
    if (!date) return null;
    const examDate = new Date(date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getNextExam = () => {
    const upcomingExams = exams
      .filter(exam => exam.date && getDaysUntilExam(exam.date)! >= 0)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcomingExams[0] || null;
  };

  const nextExam = getNextExam();
  const daysUntilNext = nextExam ? getDaysUntilExam(nextExam.date) : null;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Exam Schedule</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      {/* Next Exam Countdown */}
      {nextExam && (
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              {daysUntilNext !== null && daysUntilNext <= 7 ? (
                <AlertTriangle className="mr-2 text-orange-500" size={24} />
              ) : (
                <Clock className="mr-2 text-primary" size={24} />
              )}
              <h3>Next Exam</h3>
            </div>
            <div className="mb-4">
              <div className="text-2xl text-primary mb-1">{nextExam.subject}</div>
              <div className="text-muted-foreground">
                {nextExam.date} at {nextExam.time}
              </div>
            </div>
            {daysUntilNext !== null && (
              <div className="max-w-md mx-auto">
                <div className="flex justify-between text-sm mb-2">
                  <span>Days Until Exam</span>
                  <span className={daysUntilNext <= 7 ? 'text-orange-500' : 'text-primary'}>
                    {daysUntilNext === 0 ? 'Today!' : 
                     daysUntilNext === 1 ? 'Tomorrow' : 
                     `${daysUntilNext} days`}
                  </span>
                </div>
                <Progress 
                  value={Math.max(0, 100 - (daysUntilNext / 30) * 100)} 
                  className={`h-3 ${daysUntilNext <= 7 ? 'bg-orange-100' : ''}`}
                />
              </div>
            )}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <GraduationCap className="mr-2 text-primary" size={20} />
            <h3>Exam Schedule</h3>
          </div>
          <Button onClick={addExam} size="sm" variant="outline">
            <Plus size={16} className="mr-1" />
            Add Exam
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-20">Days Left</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam, index) => {
                const daysUntil = getDaysUntilExam(exam.date);
                return (
                  <TableRow key={exam.id} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}>
                    <TableCell>
                      <Input
                        value={exam.subject}
                        onChange={(e) => updateExam(exam.id, 'subject', e.target.value)}
                        placeholder="Subject"
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={exam.date}
                        onChange={(e) => updateExam(exam.id, 'date', e.target.value)}
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="time"
                        value={exam.time}
                        onChange={(e) => updateExam(exam.id, 'time', e.target.value)}
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={exam.weight}
                        onChange={(e) => updateExam(exam.id, 'weight', e.target.value)}
                        placeholder="30%"
                        className="border-0 bg-transparent p-1 w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={exam.notes}
                        onChange={(e) => updateExam(exam.id, 'notes', e.target.value)}
                        placeholder="Study notes..."
                        className="border-0 bg-transparent p-1 min-h-[60px] resize-none"
                      />
                    </TableCell>
                    <TableCell>
                      {daysUntil !== null && (
                        <div className={`text-center px-2 py-1 rounded text-xs ${
                          daysUntil < 0 ? 'bg-gray-100 text-gray-500' :
                          daysUntil <= 3 ? 'bg-red-100 text-red-700' :
                          daysUntil <= 7 ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {daysUntil < 0 ? 'Past' :
                           daysUntil === 0 ? 'Today' :
                           daysUntil === 1 ? 'Tomorrow' :
                           `${daysUntil} days`}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeExam(exam.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {exams.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap size={48} className="mx-auto mb-4 opacity-50" />
            <p>No exams scheduled yet. Click "Add Exam" to get started!</p>
          </div>
        )}
      </Card>
    </div>
  );
}