import { useState, useEffect } from "react";
import { Clock, Shield, AlertTriangle, ChevronLeft, ChevronRight, Flag, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CameraAccess } from "@/components/CameraAccess";
import { SecurityMonitor } from "@/components/SecurityMonitor";

interface Question {
  id: string;
  text: string;
  options: string[];
  type: 'multiple-choice' | 'true-false';
}

interface ExamInterfaceProps {
  exam: {
    id: string;
    title: string;
    duration: number;
    questions: Question[];
  };
  onSubmitExam: (answers: Record<string, string>) => void;
  onExitExam: () => void;
}

export function ExamInterface({ exam, onSubmitExam, onExitExam }: ExamInterfaceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(exam.duration * 60); // Convert to seconds
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [isSecure, setIsSecure] = useState(true);
  const [warningCount, setWarningCount] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          onSubmitExam(answers);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [answers, onSubmitExam]);

  const handleSecurityViolation = (violation: any) => {
    setWarningCount(prev => prev + 1);
    setIsSecure(false);
    
    // Auto-restore security status after some time if warnings are below threshold
    setTimeout(() => {
      if (warningCount < 3) {
        setIsSecure(true);
      }
    }, 10000);
  };

  const handleSecurityStatusChange = (secure: boolean) => {
    setIsSecure(secure);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [exam.questions[currentQuestion].id]: value
    }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const progress = ((currentQuestion + 1) / exam.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-exam-bg">
      {/* Security Header */}
      <div className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="font-semibold">{exam.title}</h1>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                isSecure ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                <Shield className="h-3 w-3" />
                {isSecure ? 'Secure Session' : `Security Warning (${warningCount}/3)`}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                cameraActive ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
              }`}>
                <Camera className="h-3 w-3" />
                {cameraActive ? 'Camera Active' : 'Camera Inactive'}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className={timeRemaining < 300 ? 'text-destructive font-medium' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={onExitExam}>
                Exit Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Question Navigation and Security Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {answeredCount} of {exam.questions.length} answered
                </div>
                <Progress value={(answeredCount / exam.questions.length) * 100} className="h-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {exam.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={currentQuestion === index ? "default" : "outline"}
                      size="sm"
                      className={`h-8 relative ${
                        answers[exam.questions[index].id] ? 'bg-success/10 border-success/30' : ''
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                      {flaggedQuestions.has(index) && (
                        <Flag className="h-2 w-2 absolute -top-1 -right-1 text-warning" fill="currentColor" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Monitor */}
            <SecurityMonitor
              isExamActive={true}
              onViolation={handleSecurityViolation}
              onSecurityStatusChange={handleSecurityStatusChange}
            />

            {/* Camera Access */}
            <CameraAccess
              onCameraStatusChange={setCameraActive}
            />
          </div>

          {/* Main Question Area */}
          <div className="lg:col-span-4">
            <Card className="min-h-[500px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Question {currentQuestion + 1} of {exam.questions.length}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {exam.questions[currentQuestion].type}
                      </Badge>
                      {!isSecure && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Security Alert ({warningCount}/3)
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFlag}
                    className={flaggedQuestions.has(currentQuestion) ? 'text-warning' : ''}
                  >
                    <Flag className="h-4 w-4" />
                    {flaggedQuestions.has(currentQuestion) ? 'Unflag' : 'Flag'}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    {exam.questions[currentQuestion].text}
                  </p>
                  
                  <RadioGroup
                    value={answers[exam.questions[currentQuestion].id] || ''}
                    onValueChange={handleAnswerChange}
                    className="space-y-3"
                  >
                    {exam.questions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label 
                          htmlFor={`option-${index}`}
                          className="flex-1 cursor-pointer text-sm leading-relaxed"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {currentQuestion === exam.questions.length - 1 ? (
                      <Button
                        variant="exam"
                        onClick={() => onSubmitExam(answers)}
                        className="px-8"
                      >
                        Submit Exam
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        onClick={() => setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}