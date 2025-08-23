import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'assignment' | 'exam' | 'holiday' | 'other';
}

export default function MonthlyCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, 'id'>>({
    date: '',
    title: '',
    description: '',
    type: 'other'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('calendarEvents');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(date);
    return events.filter(event => event.date === dateKey);
  };

  const addEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: CalendarEvent = {
        ...newEvent,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, event]);
      setNewEvent({ date: '', title: '', description: '', type: 'other' });
      setIsDialogOpen(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'assignment': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'exam': return 'bg-red-100 text-red-700 border-red-200';
      case 'holiday': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="mb-2 text-primary">Monthly Calendar</h1>
        <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
              <ChevronLeft size={16} />
            </Button>
            <h2 className="text-xl">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
              <ChevronRight size={16} />
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus size={16} className="mr-1" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Calendar Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <Label htmlFor="event-type">Type</Label>
                  <select
                    id="event-type"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as CalendarEvent['type'] }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="other">Other</option>
                    <option value="assignment">Assignment</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <Textarea
                    id="event-description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Event description (optional)"
                  />
                </div>
                <Button onClick={addEvent} className="w-full">
                  Add Event
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center bg-secondary/50 rounded-md text-sm">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-${i}`} className="p-2 h-24"></div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            const isToday = today.getDate() === day && 
                           today.getMonth() === currentDate.getMonth() && 
                           today.getFullYear() === currentDate.getFullYear();

            return (
              <div 
                key={day} 
                className={`p-2 h-24 border rounded-md bg-card overflow-y-auto ${
                  isToday ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className={`text-sm mb-1 ${isToday ? 'text-primary' : ''}`}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)}`}
                      title={event.description}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>Assignment</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
            <span>Exam</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Holiday</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
            <span>Other</span>
          </div>
        </div>
      </Card>
    </div>
  );
}