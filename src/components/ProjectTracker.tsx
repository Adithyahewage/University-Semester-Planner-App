import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Trash2, Plus, Folder, Calendar, TrendingUp } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';

interface Project {
  id: string;
  title: string;
  course: string;
  startDate: string;
  dueDate: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  progress: number;
  description: string;
  completed: boolean;
}

export default function ProjectTracker() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    } else {
      // Add empty project for demo
      setProjects([{
        id: '1',
        title: '',
        course: '',
        startDate: '',
        dueDate: '',
        status: 'planning',
        priority: 'medium',
        progress: 0,
        description: '',
        completed: false
      }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: '',
      course: '',
      startDate: '',
      dueDate: '',
      status: 'planning',
      priority: 'medium',
      progress: 0,
      description: '',
      completed: false
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const removeProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-700';
      case 'in-progress': return 'bg-yellow-100 text-yellow-700';
      case 'review': return 'bg-purple-100 text-purple-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
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

  const completedCount = projects.filter(p => p.completed).length;
  const totalCount = projects.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const avgProgress = projects.length > 0 ? projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Project Tracker</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Project Completion</h3>
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
          <div className="flex items-center justify-between mb-4">
            <h3>Average Progress</h3>
            <TrendingUp className="text-primary" size={20} />
          </div>
          <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-300"
              style={{ width: `${avgProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {avgProgress.toFixed(0)}% Average
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Folder className="mr-2 text-primary" size={20} />
            <h3>Projects</h3>
          </div>
          <Button onClick={addProject} size="sm" variant="outline">
            <Plus size={16} className="mr-1" />
            Add Project
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead className="w-12">Done</TableHead>
                <TableHead>Project Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, index) => {
                const daysUntil = getDaysUntilDue(project.dueDate);
                return (
                  <TableRow key={project.id} className={index % 2 === 0 ? 'bg-white' : 'bg-secondary/20'}>
                    <TableCell>
                      <Checkbox
                        checked={project.completed}
                        onCheckedChange={(checked) => updateProject(project.id, 'completed', checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={project.title}
                        onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                        placeholder="Project title"
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={project.course}
                        onChange={(e) => updateProject(project.id, 'course', e.target.value)}
                        placeholder="Course"
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={project.startDate}
                        onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Input
                          type="date"
                          value={project.dueDate}
                          onChange={(e) => updateProject(project.id, 'dueDate', e.target.value)}
                          className="border-0 bg-transparent p-1"
                        />
                        {daysUntil !== null && (
                          <div className={`text-xs px-2 py-1 rounded ${
                            daysUntil < 0 ? 'bg-red-100 text-red-700' :
                            daysUntil <= 7 ? 'bg-orange-100 text-orange-700' :
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
                        value={project.status} 
                        onValueChange={(value) => updateProject(project.id, 'status', value)}
                      >
                        <SelectTrigger className="border-0 bg-transparent p-1">
                          <Badge className={getStatusColor(project.status)}>
                            <SelectValue />
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={project.priority} 
                        onValueChange={(value) => updateProject(project.id, 'priority', value)}
                      >
                        <SelectTrigger className="border-0 bg-transparent p-1">
                          <Badge className={getPriorityColor(project.priority)}>
                            <SelectValue />
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={project.progress}
                            onChange={(e) => updateProject(project.id, 'progress', parseInt(e.target.value) || 0)}
                            className="border-0 bg-transparent p-1 w-16"
                          />
                          <span className="text-xs">%</span>
                        </div>
                        <Progress value={project.progress} className="w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={project.description}
                        onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                        placeholder="Description..."
                        className="border-0 bg-transparent p-1"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => removeProject(project.id)}
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

        {projects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Folder size={48} className="mx-auto mb-4 opacity-50" />
            <p>No projects added yet. Click "Add Project" to get started!</p>
          </div>
        )}
      </Card>
    </div>
  );
}