import { Clock, Users, Shield, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ExamCardProps {
  exam: {
    id: string;
    title: string;
    description: string;
    duration: number; // in minutes
    totalQuestions: number;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'active' | 'completed';
    score?: number;
    attempts?: number;
    maxAttempts: number;
  };
  onStartExam?: (examId: string) => void;
  onViewResults?: (examId: string) => void;
}

export function ExamCard({ exam, onStartExam, onViewResults }: ExamCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-warning/10 text-warning';
      case 'active': return 'bg-success/10 text-success';
      case 'completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const canStartExam = exam.status === 'active' && (!exam.attempts || exam.attempts < exam.maxAttempts);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{exam.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{exam.description}</p>
          </div>
          <Badge className={getStatusColor(exam.status)}>
            {exam.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {exam.duration} minutes
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {exam.totalQuestions} questions
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Due: {new Date(exam.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            {exam.attempts || 0}/{exam.maxAttempts} attempts
          </div>
        </div>

        {exam.status === 'completed' && exam.score !== undefined && (
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Score</span>
              <span className="text-lg font-bold">{exam.score}%</span>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          {canStartExam && (
            <Button 
              variant="exam" 
              className="flex-1"
              onClick={() => onStartExam?.(exam.id)}
            >
              Start Exam
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          
          {exam.status === 'completed' && (
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onViewResults?.(exam.id)}
            >
              View Results
            </Button>
          )}

          {exam.status === 'upcoming' && (
            <Button variant="ghost" className="flex-1" disabled>
              Exam Not Started
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}