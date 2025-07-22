import { useState } from "react";
import { BarChart3, TrendingUp, Users, Clock, Target, Award, Filter, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AnalyticsDashboardProps {
  userRole: 'candidate' | 'admin';
}

const mockAnalyticsData = {
  overview: {
    totalAttempts: 1247,
    averageScore: 78.5,
    passRate: 82.3,
    avgDuration: 87.2,
    topPerformer: "Alice Johnson",
    improvement: 15.2
  },
  examPerformance: [
    { examId: '1', title: 'Software Development', attempts: 324, avgScore: 82.1, passRate: 88.5 },
    { examId: '2', title: 'Data Structures', attempts: 298, avgScore: 75.3, passRate: 76.8 },
    { examId: '3', title: 'System Design', attempts: 156, avgScore: 71.8, passRate: 68.2 }
  ],
  timeDistribution: [
    { timeRange: '0-30 min', count: 123 },
    { timeRange: '30-60 min', count: 456 },
    { timeRange: '60-90 min', count: 398 },
    { timeRange: '90+ min', count: 187 }
  ],
  skillAnalysis: [
    { skill: 'Programming Fundamentals', avgScore: 85.2, attempts: 1200 },
    { skill: 'Algorithms', avgScore: 72.8, attempts: 980 },
    { skill: 'System Design', avgScore: 68.4, attempts: 756 },
    { skill: 'Database Management', avgScore: 79.3, attempts: 845 }
  ]
};

export function AnalyticsDashboard({ userRole }: AnalyticsDashboardProps) {
  const [timeFilter, setTimeFilter] = useState('30');
  const [examFilter, setExamFilter] = useState('all');

  const MetricCard = ({ title, value, subtitle, icon: Icon, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className={`text-xs mt-1 flex items-center gap-1 ${
                trend >= 0 ? 'text-success' : 'text-destructive'
              }`}>
                <TrendingUp className="h-3 w-3" />
                {subtitle}
              </p>
            )}
          </div>
          <Icon className="h-8 w-8 text-primary" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Filters and Export */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex items-center gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All exams" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">All Exams</SelectItem>
              <SelectItem value="1">Software Development</SelectItem>
              <SelectItem value="2">Data Structures</SelectItem>
              <SelectItem value="3">System Design</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Attempts"
          value={mockAnalyticsData.overview.totalAttempts.toLocaleString()}
          subtitle={`+${mockAnalyticsData.overview.improvement}% vs last period`}
          icon={Target}
          trend={mockAnalyticsData.overview.improvement}
        />
        <MetricCard
          title="Average Score"
          value={`${mockAnalyticsData.overview.averageScore}%`}
          subtitle="+3.2% improvement"
          icon={Award}
          trend={3.2}
        />
        <MetricCard
          title="Pass Rate"
          value={`${mockAnalyticsData.overview.passRate}%`}
          subtitle="+5.8% vs target"
          icon={TrendingUp}
          trend={5.8}
        />
        <MetricCard
          title="Avg Duration"
          value={`${mockAnalyticsData.overview.avgDuration} min`}
          subtitle="-12 min vs avg"
          icon={Clock}
          trend={-12}
        />
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="skills">Skills Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.examPerformance.map((exam) => (
                    <div key={exam.examId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{exam.title}</span>
                        <Badge variant="outline">{exam.attempts} attempts</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Average Score</span>
                          <span>{exam.avgScore}%</span>
                        </div>
                        <Progress value={exam.avgScore} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Pass Rate</span>
                        <span className={exam.passRate > 75 ? 'text-success' : 'text-warning'}>
                          {exam.passRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.timeDistribution.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.timeRange}</span>
                        <span className="text-sm text-muted-foreground">{item.count} candidates</span>
                      </div>
                      <Progress value={(item.count / 1164) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success">94.2%</div>
                    <p className="text-sm text-muted-foreground">Successfully completed</p>
                  </div>
                  <Progress value={94.2} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">1.3</div>
                    <p className="text-sm text-muted-foreground">Attempts per candidate</p>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    68% pass on first attempt
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>10:00 AM - 12:00 PM</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>2:00 PM - 4:00 PM</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>7:00 PM - 9:00 PM</span>
                    <span className="font-medium">18%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Skills Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockAnalyticsData.skillAnalysis.map((skill, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{skill.skill}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">
                          {skill.attempts} attempts
                        </span>
                        <Badge variant={skill.avgScore > 75 ? "default" : "secondary"}>
                          {skill.avgScore}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={skill.avgScore} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Trend charts would be displayed here</p>
                  <p className="text-sm">Integration with charting library (Recharts) recommended</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}