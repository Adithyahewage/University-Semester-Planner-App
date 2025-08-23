import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { CalendarDays, Target, Clock } from 'lucide-react';

interface SemesterData {
  startDate: string;
  endDate: string;
  importantDates: string;
  goals: string[];
}

export default function SemesterOverview() {
  const [semesterData, setSemesterData] = useState<SemesterData>({
    startDate: '',
    endDate: '',
    importantDates: '',
    goals: ['', '', '', '', '']
  });

  useEffect(() => {
    const saved = localStorage.getItem('semesterOverview');
    if (saved) {
      setSemesterData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('semesterOverview', JSON.stringify(semesterData));
  }, [semesterData]);

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...semesterData.goals];
    newGoals[index] = value;
    setSemesterData(prev => ({ ...prev, goals: newGoals }));
  };

  const calculateDaysLeft = () => {
    if (!semesterData.endDate) return null;
    const endDate = new Date(semesterData.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Semester Overview</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Semester Dates */}
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <CalendarDays className="mr-2 text-primary" size={20} />
            <h3>Semester Dates</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={semesterData.startDate}
                onChange={(e) => setSemesterData(prev => ({ ...prev, startDate: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={semesterData.endDate}
                onChange={(e) => setSemesterData(prev => ({ ...prev, endDate: e.target.value }))}
                className="mt-1"
              />
            </div>
            {calculateDaysLeft() !== null && (
              <div className="p-3 bg-secondary rounded-lg text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock size={16} className="mr-1 text-primary" />
                  <span className="text-sm">Days Remaining</span>
                </div>
                <div className="text-2xl text-primary">{calculateDaysLeft()}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Important Dates */}
        <Card className="p-6">
          <h3 className="mb-4">Important Dates & Holidays</h3>
          <Textarea
            placeholder="• Spring Break: March 15-22
• Registration Opens: November 1
• Final Exams: May 6-13
• Graduation: May 18"
            value={semesterData.importantDates}
            onChange={(e) => setSemesterData(prev => ({ ...prev, importantDates: e.target.value }))}
            className="min-h-[200px] resize-none"
          />
        </Card>
      </div>

      {/* Semester Goals */}
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Target className="mr-2 text-primary" size={20} />
          <h3>Semester Goals</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {semesterData.goals.map((goal, index) => (
            <div key={index}>
              <Label htmlFor={`goal-${index}`}>Goal {index + 1}</Label>
              <Input
                id={`goal-${index}`}
                value={goal}
                onChange={(e) => updateGoal(index, e.target.value)}
                placeholder={`Enter your ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} semester goal...`}
                className="mt-1"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}