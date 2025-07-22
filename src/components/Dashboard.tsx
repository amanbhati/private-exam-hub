import { useState } from "react";
import { BarChart3, Users, Clock, Shield, TrendingUp, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamCard } from "./ExamCard";

interface DashboardProps {
  userRole: 'candidate' | 'admin';
  onStartExam?: (examId: string) => void;
  onViewResults?: (examId: string) => void;
}

const mockExams = [
  {
    id: '1',
    title: 'Software Development Fundamentals',
    description: 'Comprehensive assessment covering programming concepts, algorithms, and best practices.',
    duration: 90,
    totalQuestions: 45,
    startDate: '2024-01-15T09:00:00Z',
    endDate: '2024-01-20T23:59:59Z',
    status: 'active' as const,
    attempts: 0,
    maxAttempts: 2,
  },
  {
    id: '2',
    title: 'Data Structures & Algorithms',
    description: 'Advanced assessment on data structures, algorithm complexity, and problem-solving.',
    duration: 120,
    totalQuestions: 60,
    startDate: '2024-01-10T09:00:00Z',
    endDate: '2024-01-18T23:59:59Z',
    status: 'completed' as const,
    score: 85,
    attempts: 1,
    maxAttempts: 2,
  },
  {
    id: '3',
    title: 'System Design Interview',
    description: 'Practical system design scenarios and architectural decision-making.',
    duration: 150,
    totalQuestions: 30,
    startDate: '2024-01-25T09:00:00Z',
    endDate: '2024-01-30T23:59:59Z',
    status: 'upcoming' as const,
    attempts: 0,
    maxAttempts: 1,
  },
];

const mockStats = {
  totalExams: 15,
  completedExams: 8,
  averageScore: 82.5,
  totalCandidates: 147,
  activeExams: 3,
  upcomingExams: 4,
};

export function Dashboard({ userRole, onStartExam, onViewResults }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const StatCard = ({ title, value, icon: Icon, subtitle }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {userRole === 'admin' ? 'Admin Dashboard' : 'My Exams'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {userRole === 'admin' 
            ? 'Manage exams, monitor candidates, and view analytics'
            : 'View available exams, track your progress, and manage your assessments'
          }
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="exams">
            {userRole === 'admin' ? 'All Exams' : 'My Exams'}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {userRole === 'admin' ? (
              <>
                <StatCard
                  title="Total Candidates"
                  value={mockStats.totalCandidates}
                  icon={Users}
                  subtitle="Active users"
                />
                <StatCard
                  title="Active Exams"
                  value={mockStats.activeExams}
                  icon={Clock}
                  subtitle="Currently running"
                />
                <StatCard
                  title="Total Exams"
                  value={mockStats.totalExams}
                  icon={BarChart3}
                  subtitle="All time"
                />
                <StatCard
                  title="Avg Score"
                  value={`${mockStats.averageScore}%`}
                  icon={TrendingUp}
                  subtitle="Overall performance"
                />
              </>
            ) : (
              <>
                <StatCard
                  title="Completed"
                  value={mockStats.completedExams}
                  icon={Award}
                  subtitle="Exams finished"
                />
                <StatCard
                  title="Average Score"
                  value={`${mockStats.averageScore}%`}
                  icon={TrendingUp}
                  subtitle="Your performance"
                />
                <StatCard
                  title="Active Exams"
                  value={mockStats.activeExams}
                  icon={Clock}
                  subtitle="Available now"
                />
                <StatCard
                  title="Upcoming"
                  value={mockStats.upcomingExams}
                  icon={BarChart3}
                  subtitle="Starting soon"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Proctoring Active</span>
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Browser Security</span>
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Privacy Protection</span>
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userRole === 'admin' ? (
                  <>
                    <Button variant="outline" className="w-full justify-start">
                      Create New Exam
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Manage Candidates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      View Reports
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="exam" className="w-full">
                      Start Available Exam
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      View My Results
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Update Profile
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exams" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockExams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onStartExam={onStartExam}
                onViewResults={onViewResults}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Analytics charts would be displayed here</p>
                    <p className="text-sm">Integration with charting library needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Award className="h-4 w-4 text-success" />
                    <div>
                      <p className="text-sm font-medium">Exam Completed</p>
                      <p className="text-xs text-muted-foreground">Data Structures & Algorithms - 85%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Exam Started</p>
                      <p className="text-xs text-muted-foreground">Software Development Fundamentals</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}