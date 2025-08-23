import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Plus, FileText, Calendar } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Assignment {
  id: string;
  subject: string;
  name: string;
  dueDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  notes: string;
  completed: boolean;
}

export default function AssignmentTracker() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('assignments');
    if (saved) {
      setAssignments(JSON.parse(saved));
    } else {
      // Add empty assignment for demo
      setAssignments([{
        id: '1',
        subject: '',
        name: '',
        dueDate: '',
        status: 'not-started',
        notes: '',
        completed: false
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  const addAssignment = () => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      subject: '',
      name: '',
      dueDate: '',
      status: 'not-started',
      notes: '',
      completed: false
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const updateAssignment = (id: string, field: keyof Assignment, value: any) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, [field]: value } : assignment
    ));
  };

  const removeAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
  };

  const getStatusColor = (status: Assignment['status']) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    if (!dueDate) return null;
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const completedCount = assignments.filter(a => a.completed).length;
  const totalCount = assignments.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Assignment & Project Tracker</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3>Progress Overview</h3>
          <span className="text-sm text-muted-foreground">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {progressPercentage.toFixed(0)}% Complete
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="mr-2 text-primary" size={20} />
            <h3>Assignments & Projects</h3>
          </div>
          <Button onClick={addAssignment} size="sm" variant="outline">
            <Plus size={16} className="mr-1" />
            Add Assignment
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="w-12">Done</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Assignment Name</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment, index) => {
                const daysUntil = getDaysUntilDue(assignment.dueDate);
                return (
                  <TableRow key={assignment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}>
                    <TableCell>
                      <Checkbox
                        checked={assignment.completed}
                        onCheckedChange={(checked) => updateAssignment(assignment.id, 'completed', checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={assignment.subject}
                        onChange={(e) => updateAssignment(assignment.id, 'subject', e.target.value)}
                        placeholder="Subject"
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={assignment.name}
                        onChange={(e) => updateAssignment(assignment.id, 'name', e.target.value)}
                        placeholder="Assignment name"
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Input
                          type="date"
                          value={assignment.dueDate}
                          onChange={(e) => updateAssignment(assignment.id, 'dueDate', e.target.value)}
                          className="border-0 bg-transparent p-1"
                        />
                        {daysUntil !== null && (
                          <div className={`text-xs px-2 py-1 rounded ${
                            daysUntil < 0 ? 'bg-red-100 text-red-700' :
                            daysUntil <= 3 ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
                             daysUntil === 0 ? 'Due today' :
                             `${daysUntil} days left`}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={assignment.status} 
                        onValueChange={(value) => updateAssignment(assignment.id, 'status', value)}
                      >
                        <SelectTrigger className="border-0 bg-transparent p-1">
                          <Badge className={getStatusColor(assignment.status)}>
                            <SelectValue />
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={assignment.notes}
                        onChange={(e) => updateAssignment(assignment.id, 'notes', e.target.value)}
                        placeholder="Notes..."
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeAssignment(assignment.id)}
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

        {assignments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText size={48} className="mx-auto mb-4 opacity-50" />
            <p>No assignments added yet. Click "Add Assignment" to get started!</p>
          </div>
        )}
      </Card>
    </div>
  );
}