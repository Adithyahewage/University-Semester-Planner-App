import { GraduationCap, BookOpen, Calendar, Target } from 'lucide-react';

export default function CoverPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center">
      <div className="mb-8 flex space-x-4">
        <GraduationCap size={48} className="text-primary" />
        <BookOpen size={48} className="text-accent" />
        <Calendar size={48} className="text-primary" />
        <Target size={48} className="text-accent" />
      </div>
      
      <h1 className="mb-4 text-4xl md:text-6xl tracking-tight text-primary">
        Ultimate Semester Planner
      </h1>
      
      <h2 className="mb-8 text-xl md:text-2xl text-muted-foreground">
        Plan, Organize & Stay on Track All Semester
      </h2>
      
      <div className="mb-8 w-full max-w-md h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full w-3/4 bg-gradient-to-r from-primary to-accent rounded-full"></div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        For University Students
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-center max-w-2xl">
        <div className="p-3 bg-card rounded-lg border">
          <div className="mb-2 text-primary">📚</div>
          <div>Course Tracking</div>
        </div>
        <div className="p-3 bg-card rounded-lg border">
          <div className="mb-2 text-primary">📝</div>
          <div>Assignment Manager</div>
        </div>
        <div className="p-3 bg-card rounded-lg border">
          <div className="mb-2 text-primary">📅</div>
          <div>Calendar Planning</div>
        </div>
        <div className="p-3 bg-card rounded-lg border">
          <div className="mb-2 text-primary">🎯</div>
          <div>Goal Tracking</div>
        </div>
      </div>
      
      <div className="mt-12 text-xs text-muted-foreground">
        Academic Year 2025
      </div>
    </div>
  );
}