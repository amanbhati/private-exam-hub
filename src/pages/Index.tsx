import { useState } from "react";
import { Landing } from "./Landing";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/Dashboard";
import { ExamInterface } from "@/components/ExamInterface";

const mockExamData = {
  id: '1',
  title: 'Software Development Fundamentals',
  duration: 90,
  questions: [
    {
      id: 'q1',
      text: 'Which of the following is a key principle of object-oriented programming?',
      options: [
        'Encapsulation',
        'Recursion',
        'Iteration',
        'Compilation'
      ],
      type: 'multiple-choice' as const
    },
    {
      id: 'q2',
      text: 'What is the time complexity of binary search in a sorted array?',
      options: [
        'O(n)',
        'O(log n)',
        'O(n²)',
        'O(1)'
      ],
      type: 'multiple-choice' as const
    },
    {
      id: 'q3',
      text: 'In agile development, what is the purpose of a sprint retrospective?',
      options: [
        'To plan the next sprint',
        'To review and improve team processes',
        'To demonstrate completed work',
        'To estimate story points'
      ],
      type: 'multiple-choice' as const
    }
  ]
};

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'exam'>('landing');
  const [user, setUser] = useState<{ name: string; role: 'candidate' | 'admin' } | null>(null);

  const handleLogin = (role: 'candidate' | 'admin') => {
    setUser({
      name: role === 'admin' ? 'Admin User' : 'John Doe',
      role
    });
    setCurrentView('dashboard');
  };

  const handleStartExam = (examId: string) => {
    setCurrentView('exam');
  };

  const handleSubmitExam = (answers: Record<string, string>) => {
    console.log('Exam submitted:', answers);
    // Calculate score and redirect to results
    setCurrentView('dashboard');
  };

  const handleExitExam = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  if (currentView === 'landing') {
    return (
      <div>
        <Landing />
        {/* Demo buttons for testing */}
        <div className="fixed bottom-4 right-4 space-y-2 z-50">
          <div className="bg-background border rounded-lg p-4 shadow-lg">
            <p className="text-sm font-medium mb-2">Demo Access:</p>
            <button 
              onClick={() => handleLogin('candidate')}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-muted rounded mb-1"
            >
              Login as Candidate
            </button>
            <button 
              onClick={() => handleLogin('admin')}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-muted rounded"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'exam') {
    return (
      <ExamInterface
        exam={mockExamData}
        onSubmitExam={handleSubmitExam}
        onExitExam={handleExitExam}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={handleLogout} />
      <Dashboard
        userRole={user?.role || 'candidate'}
        onStartExam={handleStartExam}
        onViewResults={(examId) => console.log('View results for:', examId)}
      />
    </div>
  );
};

export default Index;
