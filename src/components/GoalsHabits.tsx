import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Target, TrendingUp, Calendar, Plus, Trash2 } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
}

interface Habit {
  id: string;
  name: string;
  streak: number;
  weeklyProgress: boolean[];
}

export default function GoalsHabits() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    const savedHabits = localStorage.getItem('habits');
    
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals([
        { id: '1', title: '', description: '', progress: 0, targetDate: '' },
        { id: '2', title: '', description: '', progress: 0, targetDate: '' },
        { id: '3', title: '', description: '', progress: 0, targetDate: '' }
      ]);
    }

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits([
        { id: '1', name: '', streak: 0, weeklyProgress: [false, false, false, false, false, false, false] },
        { id: '2', name: '', streak: 0, weeklyProgress: [false, false, false, false, false, false, false] }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const updateGoal = (id: string, field: keyof Goal, value: any) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const addGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: '',
      description: '',
      progress: 0,
      targetDate: ''
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const removeGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const updateHabit = (id: string, field: keyof Habit, value: any) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, [field]: value } : habit
    ));
  };

  const updateHabitDay = (habitId: string, dayIndex: number, checked: boolean) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const newProgress = [...habit.weeklyProgress];
        newProgress[dayIndex] = checked;
        
        // Update streak
        let newStreak = habit.streak;
        if (checked && dayIndex === 6) { // If Sunday is checked, increment streak
          const weekCompleted = newProgress.every(day => day);
          if (weekCompleted) {
            newStreak += 1;
          }
        }
        
        return { ...habit, weeklyProgress: newProgress, streak: newStreak };
      }
      return habit;
    }));
  };

  const addHabit = () => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: '',
      streak: 0,
      weeklyProgress: [false, false, false, false, false, false, false]
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const removeHabit = (id: string) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  const getDaysUntilTarget = (targetDate: string) => {
    if (!targetDate) return null;
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Goals & Habit Tracker</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      {/* Semester Goals */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Target className="mr-2 text-primary" size={20} />
            <h3>Semester Goals</h3>
          </div>
          <Button onClick={addGoal} size="sm" variant="outline">
            <Plus size={16} className="mr-1" />
            Add Goal
          </Button>
        </div>

        <div className="space-y-6">
          {goals.map((goal, index) => {
            const daysLeft = getDaysUntilTarget(goal.targetDate);
            return (
              <div key={goal.id} className="p-4 border rounded-lg bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 space-y-3">
                    <Input
                      value={goal.title}
                      onChange={(e) => updateGoal(goal.id, 'title', e.target.value)}
                      placeholder={`Goal ${index + 1} title...`}
                      className="text-lg"
                    />
                    <Textarea
                      value={goal.description}
                      onChange={(e) => updateGoal(goal.id, 'description', e.target.value)}
                      placeholder="Describe your goal and action steps..."
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                  <Button
                    onClick={() => removeGoal(goal.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive ml-2"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Target Date</label>
                    <Input
                      type="date"
                      value={goal.targetDate}
                      onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                    />
                    {daysLeft !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {daysLeft === 0 ? 'Due today!' : `${daysLeft} days left`}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-1">Progress (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => updateGoal(goal.id, 'progress', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Target size={48} className="mx-auto mb-4 opacity-50" />
            <p>No goals set yet. Click "Add Goal" to get started!</p>
          </div>
        )}
      </Card>

      {/* Habit Tracker */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="mr-2 text-primary" size={20} />
            <h3>Weekly Habit Tracker</h3>
          </div>
          <Button onClick={addHabit} size="sm" variant="outline">
            <Plus size={16} className="mr-1" />
            Add Habit
          </Button>
        </div>

        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_repeat(7,1fr)_auto] gap-2 items-center text-sm">
            <div className="p-2">Habit</div>
            <div className="p-2 text-center">Streak</div>
            {dayNames.map(day => (
              <div key={day} className="p-2 text-center">{day}</div>
            ))}
            <div className="p-2"></div>
          </div>

          {/* Habits */}
          {habits.map((habit) => (
            <div key={habit.id} className="grid grid-cols-[1fr_auto_repeat(7,1fr)_auto] gap-2 items-center p-2 border rounded-lg bg-card">
              <Input
                value={habit.name}
                onChange={(e) => updateHabit(habit.id, 'name', e.target.value)}
                placeholder="Habit name..."
                className="border-0 bg-transparent p-1"
              />
              
              <div className="text-center">
                <div className="px-2 py-1 bg-primary/10 text-primary rounded text-sm">
                  {habit.streak}
                </div>
              </div>

              {habit.weeklyProgress.map((completed, dayIndex) => (
                <div key={dayIndex} className="flex justify-center">
                  <Checkbox
                    checked={completed}
                    onCheckedChange={(checked) => updateHabitDay(habit.id, dayIndex, checked as boolean)}
                  />
                </div>
              ))}

              <Button
                onClick={() => removeHabit(habit.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        {habits.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
            <p>No habits to track yet. Click "Add Habit" to get started!</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            📅 Check off each day you complete your habit. Complete all 7 days to increase your streak!
          </p>
        </div>
      </Card>
    </div>
  );
}