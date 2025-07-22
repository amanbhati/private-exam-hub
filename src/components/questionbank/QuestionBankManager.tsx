import { useState } from "react";
import { Plus, Search, Filter, Tag, Edit, Trash2, Copy, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  options?: string[];
  correctAnswer?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    text: 'Which of the following is a key principle of object-oriented programming?',
    type: 'multiple-choice',
    options: ['Encapsulation', 'Recursion', 'Iteration', 'Compilation'],
    correctAnswer: 'Encapsulation',
    difficulty: 'medium',
    category: 'Programming Fundamentals',
    tags: ['OOP', 'Concepts', 'Fundamentals'],
    createdAt: '2024-01-10',
    lastUsed: '2024-01-20',
    usageCount: 45
  },
  {
    id: 'q2',
    text: 'What is the time complexity of binary search in a sorted array?',
    type: 'multiple-choice',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 'O(log n)',
    difficulty: 'medium',
    category: 'Algorithms',
    tags: ['Binary Search', 'Time Complexity', 'Data Structures'],
    createdAt: '2024-01-08',
    lastUsed: '2024-01-22',
    usageCount: 38
  },
  {
    id: 'q3',
    text: 'Explain the difference between SQL and NoSQL databases.',
    type: 'essay',
    difficulty: 'hard',
    category: 'Database Management',
    tags: ['SQL', 'NoSQL', 'Database Design'],
    createdAt: '2024-01-12',
    lastUsed: '2024-01-19',
    usageCount: 23
  }
];

const categories = ['Programming Fundamentals', 'Algorithms', 'Database Management', 'System Design', 'Web Development'];
const allTags = ['OOP', 'Concepts', 'Fundamentals', 'Binary Search', 'Time Complexity', 'Data Structures', 'SQL', 'NoSQL', 'Database Design'];

export function QuestionBankManager() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'multiple-choice' as const,
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'medium' as const,
    category: '',
    tags: [] as string[]
  });

  const filteredQuestions = questions.filter(question => {
    if (searchTerm && !question.text.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (selectedCategory !== 'all' && question.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && question.difficulty !== selectedDifficulty) return false;
    if (selectedTags.length > 0 && !selectedTags.some(tag => question.tags.includes(tag))) return false;
    return true;
  });

  const handleCreateQuestion = () => {
    const question: Question = {
      id: `q${Date.now()}`,
      ...newQuestion,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    setQuestions([...questions, question]);
    setNewQuestion({
      text: '',
      type: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      difficulty: 'medium',
      category: '',
      tags: []
    });
    setIsCreateDialogOpen(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const handleDuplicateQuestion = (question: Question) => {
    const duplicated: Question = {
      ...question,
      id: `q${Date.now()}`,
      text: `${question.text} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
      lastUsed: undefined
    };
    setQuestions([...questions, duplicated]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Question Bank</h2>
          <p className="text-muted-foreground">Manage your examination questions and content</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Enter your question here..."
                  className="min-h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select 
                    value={newQuestion.type} 
                    onValueChange={(value: any) => setNewQuestion({...newQuestion, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="essay">Essay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select 
                    value={newQuestion.difficulty} 
                    onValueChange={(value: any) => setNewQuestion({...newQuestion, difficulty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newQuestion.type === 'multiple-choice' && (
                <div>
                  <Label>Answer Options</Label>
                  <div className="space-y-2">
                    {newQuestion.options.map((option, index) => (
                      <Input
                        key={index}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOptions});
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label>Correct Answer</Label>
                    <Select 
                      value={newQuestion.correctAnswer} 
                      onValueChange={(value) => setNewQuestion({...newQuestion, correctAnswer: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select correct answer" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {newQuestion.options.filter(opt => opt.trim()).map((option, index) => (
                          <SelectItem key={index} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newQuestion.category} 
                  onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateQuestion}>
                  Create Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-xl font-bold">{questions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-xl font-bold">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Most Used</p>
              <p className="text-sm font-medium">Programming Fundamentals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Avg Usage</p>
              <p className="text-xl font-bold">35.3</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {question.type}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {question.category}
                    </Badge>
                  </div>
                  
                  <p className="font-medium">{question.text}</p>
                  
                  {question.options && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Options:</span> {question.options.join(', ')}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Created: {question.createdAt}</span>
                    <span>Used: {question.usageCount} times</span>
                    {question.lastUsed && <span>Last used: {question.lastUsed}</span>}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {question.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingQuestion(question)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDuplicateQuestion(question)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No questions found matching your criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}