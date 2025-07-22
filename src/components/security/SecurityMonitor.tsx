import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Eye, Monitor, Clock, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecurityEvent {
  id: string;
  type: 'tab_switch' | 'window_blur' | 'right_click' | 'copy_attempt' | 'fullscreen_exit' | 'devtools_open';
  timestamp: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  candidateId?: string;
  examId?: string;
}

interface SecurityMonitorProps {
  isExamActive: boolean;
  onSecurityViolation?: (event: SecurityEvent) => void;
}

const mockSecurityEvents: SecurityEvent[] = [
  {
    id: 'se1',
    type: 'tab_switch',
    timestamp: new Date().toISOString(),
    description: 'User switched to another tab during exam',
    severity: 'high',
    candidateId: 'c1',
    examId: 'e1'
  },
  {
    id: 'se2',
    type: 'right_click',
    timestamp: new Date(Date.now() - 300000).toISOString(),
    description: 'Right-click attempted on question',
    severity: 'medium',
    candidateId: 'c1',
    examId: 'e1'
  },
  {
    id: 'se3',
    type: 'window_blur',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    description: 'Window lost focus',
    severity: 'medium',
    candidateId: 'c1',
    examId: 'e1'
  }
];

export function SecurityMonitor({ isExamActive, onSecurityViolation }: SecurityMonitorProps) {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>(mockSecurityEvents);
  const [securityScore, setSecurityScore] = useState(85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [blockedAttempts, setBlockedAttempts] = useState(0);

  useEffect(() => {
    if (!isExamActive) return;

    // Monitor tab visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const event: SecurityEvent = {
          id: `se${Date.now()}`,
          type: 'tab_switch',
          timestamp: new Date().toISOString(),
          description: 'User switched away from exam tab',
          severity: 'high'
        };
        setSecurityEvents(prev => [event, ...prev]);
        onSecurityViolation?.(event);
        setSecurityScore(prev => Math.max(0, prev - 10));
      }
    };

    // Monitor window blur
    const handleWindowBlur = () => {
      const event: SecurityEvent = {
        id: `se${Date.now()}`,
        type: 'window_blur',
        timestamp: new Date().toISOString(),
        description: 'Exam window lost focus',
        severity: 'medium'
      };
      setSecurityEvents(prev => [event, ...prev]);
      onSecurityViolation?.(event);
      setSecurityScore(prev => Math.max(0, prev - 5));
    };

    // Monitor right-click
    const handleRightClick = (e: MouseEvent) => {
      e.preventDefault();
      const event: SecurityEvent = {
        id: `se${Date.now()}`,
        type: 'right_click',
        timestamp: new Date().toISOString(),
        description: 'Right-click menu attempted',
        severity: 'low'
      };
      setSecurityEvents(prev => [event, ...prev]);
      setBlockedAttempts(prev => prev + 1);
    };

    // Monitor copy attempts
    const handleCopy = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'a' || e.key === 'v')) {
        e.preventDefault();
        const event: SecurityEvent = {
          id: `se${Date.now()}`,
          type: 'copy_attempt',
          timestamp: new Date().toISOString(),
          description: `${e.key === 'c' ? 'Copy' : e.key === 'a' ? 'Select All' : 'Paste'} attempt blocked`,
          severity: 'medium'
        };
        setSecurityEvents(prev => [event, ...prev]);
        setBlockedAttempts(prev => prev + 1);
      }
    };

    // Monitor fullscreen exit
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen && isExamActive) {
        const event: SecurityEvent = {
          id: `se${Date.now()}`,
          type: 'fullscreen_exit',
          timestamp: new Date().toISOString(),
          description: 'Fullscreen mode exited during exam',
          severity: 'high'
        };
        setSecurityEvents(prev => [event, ...prev]);
        onSecurityViolation?.(event);
        setSecurityScore(prev => Math.max(0, prev - 15));
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', handleRightClick);
    document.addEventListener('keydown', handleCopy);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Prevent F12, Ctrl+Shift+I, Ctrl+U
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        const event: SecurityEvent = {
          id: `se${Date.now()}`,
          type: 'devtools_open',
          timestamp: new Date().toISOString(),
          description: 'Developer tools access attempted',
          severity: 'high'
        };
        setSecurityEvents(prev => [event, ...prev]);
        setBlockedAttempts(prev => prev + 1);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('contextmenu', handleRightClick);
      document.removeEventListener('keydown', handleCopy);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExamActive, onSecurityViolation]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted text-muted-foreground border-muted';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <div className="space-y-6">
      {/* Security Status Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
            {isExamActive && (
              <Badge variant={securityScore >= 80 ? "default" : securityScore >= 60 ? "secondary" : "destructive"}>
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Score</span>
                <span className={`font-bold ${getSecurityScoreColor(securityScore)}`}>
                  {securityScore}%
                </span>
              </div>
              <Progress value={securityScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blocked Attempts</span>
                <span className="font-bold">{blockedAttempts}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Unauthorized actions prevented
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Violations</span>
                <span className="font-bold text-destructive">
                  {securityEvents.filter(e => e.severity === 'high').length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                High-severity incidents
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Display Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Fullscreen Mode</p>
                <p className="text-xs text-muted-foreground">
                  Prevents access to other applications
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isFullscreen ? "default" : "outline"}>
                  {isFullscreen ? 'Active' : 'Inactive'}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                >
                  {isFullscreen ? 'Exit' : 'Enter'}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Copy Protection</p>
                <p className="text-xs text-muted-foreground">
                  Blocks copy, paste, and select all
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Right-Click Disabled</p>
                <p className="text-xs text-muted-foreground">
                  Prevents context menu access
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Monitoring Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tab Monitoring</p>
                <p className="text-xs text-muted-foreground">
                  Detects tab switches and window focus
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">DevTools Detection</p>
                <p className="text-xs text-muted-foreground">
                  Blocks F12 and developer shortcuts
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Activity Logging</p>
                <p className="text-xs text-muted-foreground">
                  Records all security events
                </p>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Security Events
            {securityEvents.length > 0 && (
              <Badge variant="outline">{securityEvents.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {securityEvents.length > 0 ? (
            <div className="space-y-3">
              {securityEvents.slice(0, 10).map((event) => (
                <Alert key={event.id}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={getSeverityColor(event.severity)}>
                        {event.severity}
                      </Badge>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No security events recorded</p>
              <p className="text-sm">All security measures are functioning normally</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}