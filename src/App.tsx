import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./components/Auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import CoverPage from "./components/CoverPage";
import SemesterOverview from "./components/SemesterOverview";
import CourseTracker from "./components/CourseTracker";
import AssignmentTracker from "./components/AssignmentTracker";
import ProjectTracker from "./components/ProjectTracker";
import ExamSchedule from "./components/ExamSchedule";
import MonthlyCalendar from "./components/MonthlyCalendar";
import GoalsHabits from "./components/GoalsHabits";
import Notes from "./components/Notes";
import {
  Home,
  Calendar,
  BookOpen,
  FileText,
  Folder,
  GraduationCap,
  CalendarDays,
  Target,
  StickyNote,
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("cover");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return <Auth />;
  }

  // Session display component
  function SessionDisplay() {
    const user = session?.user;
    const handleLogout = async () => {
      await supabase.auth.signOut();
    };
    return (
      <div className="flex items-center gap-4 justify-end py-2 px-2 text-sm">
        <span className="text-muted-foreground">{user?.email}</span>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          onClick={handleLogout}
        >
          Log out
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "cover", label: "Cover", icon: Home, component: CoverPage },
    {
      id: "overview",
      label: "Overview",
      icon: Calendar,
      component: SemesterOverview,
    },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      component: CourseTracker,
    },
    {
      id: "assignments",
      label: "Assignments",
      icon: FileText,
      component: AssignmentTracker,
    },
    {
      id: "projects",
      label: "Projects",
      icon: Folder,
      component: ProjectTracker,
    },
    {
      id: "exams",
      label: "Exams",
      icon: GraduationCap,
      component: ExamSchedule,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarDays,
      component: MonthlyCalendar,
    },
    {
      id: "goals",
      label: "Goals & Habits",
      icon: Target,
      component: GoalsHabits,
    },
    { id: "notes", label: "Notes", icon: StickyNote, component: Notes },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Navigation Header + Session Display */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="grid w-full grid-cols-9 h-14 bg-secondary/30">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm p-2"
                  >
                    <tab.icon size={16} className="shrink-0" />
                    <span className="hidden sm:block">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              <SessionDisplay />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="container mx-auto px-4 py-6">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <tab.component />
            </TabsContent>
          ))}
        </div>

        {/* Footer */}
        <footer className="border-t border-border bg-card mt-12">
          <div className="container mx-auto px-4 py-6">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">Ultimate Semester Planner</p>
              <p>Built for University Students • Academic Year 2025</p>
              <div className="mt-4 text-xs">
                💡 All your data is saved locally in your browser
              </div>
            </div>
          </div>
        </footer>
      </Tabs>
    </div>
  );
}
