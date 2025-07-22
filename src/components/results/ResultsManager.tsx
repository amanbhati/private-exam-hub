import { useState } from "react";
import { Award, TrendingUp, Clock, Users, Download, Eye, Filter, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExamResult {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  totalTime: number;
  completedAt: string;
  startedAt: string;
  status: 'completed' | 'in-progress' | 'abandoned';
  skillBreakdown: {
    skill: string;
    score: number;
    maxScore: number;
  }[];
  flaggedQuestions: number[];
  securityViolations: string[];
}

const mockResults: ExamResult[] = [
  {
    id: 'r1',
    candidateId: 'c1',
    candidateName: 'John Doe',
    candidateEmail: 'john.doe@example.com',
    examId: 'e1',
    examTitle: 'Software Development Fundamentals',
    score: 85,
    totalQuestions: 45,
    correctAnswers: 38,
    timeSpent: 87,
    totalTime: 90,
    completedAt: '2024-01-20T14:30:00Z',
    startedAt: '2024-01-20T13:03:00Z',
    status: 'completed',
    skillBreakdown: [
      { skill: 'Programming Concepts', score: 18, maxScore: 20 },
      { skill: 'Algorithms', score: 12, maxScore: 15 },
      { skill: 'Data Structures', score: 8, maxScore: 10 }
    ],
    flaggedQuestions: [5, 12, 28],
    securityViolations: []
  },
  {
    id: 'r2',
    candidateId: 'c2',
    candidateName: 'Jane Smith',
    candidateEmail: 'jane.smith@example.com',
    examId: 'e1',
    examTitle: 'Software Development Fundamentals',
    score: 92,
    totalQuestions: 45,
    correctAnswers: 41,
    timeSpent: 72,
    totalTime: 90,
    completedAt: '2024-01-20T11:15:00Z',
    startedAt: '2024-01-20T09:43:00Z',
    status: 'completed',
    skillBreakdown: [
      { skill: 'Programming Concepts', score: 20, maxScore: 20 },
      { skill: 'Algorithms', score: 14, maxScore: 15 },
      { skill: 'Data Structures', score: 7, maxScore: 10 }
    ],
    flaggedQuestions: [15],
    securityViolations: ['Tab switched during question 23']
  },
  {
    id: 'r3',
    candidateId: 'c3',
    candidateName: 'Mike Johnson',
    candidateEmail: 'mike.johnson@example.com',
    examId: 'e2',
    examTitle: 'Data Structures & Algorithms',
    score: 78,
    totalQuestions: 60,
    correctAnswers: 47,
    timeSpent: 115,
    totalTime: 120,
    completedAt: '2024-01-19T16:45:00Z',
    startedAt: '2024-01-19T14:50:00Z',
    status: 'completed',
    skillBreakdown: [
      { skill: 'Arrays & Strings', score: 16, maxScore: 20 },
      { skill: 'Trees & Graphs', score: 12, maxScore: 20 },
      { skill: 'Dynamic Programming', score: 19, maxScore: 20 }
    ],
    flaggedQuestions: [8, 22, 35, 48],
    securityViolations: []
  }
];

interface ResultsManagerProps {
  userRole: 'candidate' | 'admin';
  currentUserId?: string;
}

export function ResultsManager({ userRole, currentUserId }: ResultsManagerProps) {
  const [results, setResults] = useState<ExamResult[]>(mockResults);
  const [selectedResult, setSelectedResult] = useState<ExamResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter results based on user role
  const filteredResults = results.filter(result => {
    if (userRole === 'candidate' && result.candidateId !== currentUserId) return false;
    if (searchTerm && !result.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !result.examTitle.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (examFilter !== 'all' && result.examId !== examFilter) return false;
    if (statusFilter !== 'all' && result.status !== statusFilter) return false;
    return true;
  });

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getGradeLetter = (score: number) => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const exportResults = () => {
    const csvContent = [
      ['Candidate', 'Email', 'Exam', 'Score', 'Grade', 'Time Spent', 'Completed At'],
      ...filteredResults.map(result => [
        result.candidateName,
        result.candidateEmail,
        result.examTitle,
        result.score.toString(),
        getGradeLetter(result.score),
        formatDuration(result.timeSpent),
        new Date(result.completedAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exam-results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {userRole === 'admin' ? 'Exam Results' : 'My Results'}
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'admin' ? 'View and analyze candidate performance' : 'Track your exam performance and progress'}
          </p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={exportResults}>
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
        )}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Results</p>
                <p className="text-xl font-bold">{filteredResults.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Average Score</p>
                <p className="text-xl font-bold">
                  {Math.round(filteredResults.reduce((acc, r) => acc + r.score, 0) / filteredResults.length)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-xl font-bold">
                  {Math.round((filteredResults.filter(r => r.score >= 70).length / filteredResults.length) * 100)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-xl font-bold">
                  {formatDuration(Math.round(filteredResults.reduce((acc, r) => acc + r.timeSpent, 0) / filteredResults.length))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <Input
                placeholder={userRole === 'admin' ? "Search by candidate or exam..." : "Search exams..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={examFilter} onValueChange={setExamFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Exams" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Exams</SelectItem>
                <SelectItem value="e1">Software Development</SelectItem>
                <SelectItem value="e2">Data Structures</SelectItem>
                <SelectItem value="e3">System Design</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="abandoned">Abandoned</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    {userRole === 'admin' && (
                      <div>
                        <p className="font-medium">{result.candidateName}</p>
                        <p className="text-sm text-muted-foreground">{result.candidateEmail}</p>
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{result.examTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Completed: {new Date(result.completedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <Badge className={`${getGradeColor(result.score)} font-bold`}>
                        {result.score}% ({getGradeLetter(result.score)})
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Correct:</span>
                      <span className="text-sm font-medium">
                        {result.correctAnswers}/{result.totalQuestions}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{formatDuration(result.timeSpent)}</span>
                    </div>
                    
                    {result.securityViolations.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {result.securityViolations.length} security alerts
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Overall Progress</div>
                    <Progress value={result.score} className="h-2" />
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedResult(result)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Detailed Results - {result.examTitle}</DialogTitle>
                    </DialogHeader>
                    
                    {selectedResult && (
                      <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="breakdown">Skill Breakdown</TabsTrigger>
                          <TabsTrigger value="security">Security Log</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-center">
                                  <div className={`text-3xl font-bold ${getGradeColor(selectedResult.score)}`}>
                                    {selectedResult.score}%
                                  </div>
                                  <p className="text-sm text-muted-foreground">Final Score</p>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-center">
                                  <div className="text-3xl font-bold">
                                    {selectedResult.correctAnswers}/{selectedResult.totalQuestions}
                                  </div>
                                  <p className="text-sm text-muted-foreground">Correct Answers</p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Time Spent</span>
                              <span>{formatDuration(selectedResult.timeSpent)} / {formatDuration(selectedResult.totalTime)}</span>
                            </div>
                            <Progress value={(selectedResult.timeSpent / selectedResult.totalTime) * 100} className="h-2" />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Exam Timeline</div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <div>Started: {new Date(selectedResult.startedAt).toLocaleString()}</div>
                              <div>Completed: {new Date(selectedResult.completedAt).toLocaleString()}</div>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="breakdown" className="space-y-4">
                          {selectedResult.skillBreakdown.map((skill, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="font-medium">{skill.skill}</span>
                                <span className="text-sm">
                                  {skill.score}/{skill.maxScore} ({Math.round((skill.score / skill.maxScore) * 100)}%)
                                </span>
                              </div>
                              <Progress value={(skill.score / skill.maxScore) * 100} className="h-2" />
                            </div>
                          ))}
                        </TabsContent>
                        
                        <TabsContent value="security" className="space-y-4">
                          {selectedResult.securityViolations.length > 0 ? (
                            <div className="space-y-2">
                              {selectedResult.securityViolations.map((violation, index) => (
                                <div key={index} className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                                  <div className="text-sm text-destructive">{violation}</div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <div className="text-success">✓ No security violations detected</div>
                              <p className="text-sm mt-2">This exam was completed without any security concerns.</p>
                            </div>
                          )}
                          
                          {selectedResult.flaggedQuestions.length > 0 && (
                            <div className="space-y-2">
                              <div className="font-medium">Flagged Questions</div>
                              <div className="text-sm text-muted-foreground">
                                Questions {selectedResult.flaggedQuestions.join(', ')} were flagged for review.
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No results found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}