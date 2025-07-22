import { useState, useEffect, useRef } from "react";
import { AlertTriangle, Eye, EyeOff, Shield, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface SecurityViolation {
  id: string;
  type: 'tab_switch' | 'window_blur' | 'fullscreen_exit' | 'copy_attempt' | 'paste_attempt';
  timestamp: Date;
  description: string;
}

interface SecurityMonitorProps {
  isExamActive?: boolean;
  onViolation?: (violation: SecurityViolation) => void;
  onSecurityStatusChange?: (isSecure: boolean) => void;
  className?: string;
}

export function SecurityMonitor({ 
  isExamActive = false, 
  onViolation, 
  onSecurityStatusChange,
  className 
}: SecurityMonitorProps) {
  const [violations, setViolations] = useState<SecurityViolation[]>([]);
  const [warningCount, setWarningCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTabActive, setIsTabActive] = useState(true);
  const [isSecure, setIsSecure] = useState(true);
  const [lastViolationTime, setLastViolationTime] = useState<Date | null>(null);
  
  const violationTimeoutRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const MAX_WARNINGS = 3;

  useEffect(() => {
    if (!isExamActive) return;

    const handleVisibilityChange = () => {
      const isVisible = !document.hidden;
      setIsTabActive(isVisible);
      
      if (!isVisible) {
        logViolation('tab_switch', 'Switched to another tab or window');
      }
    };

    const handleWindowBlur = () => {
      if (document.hasFocus && !document.hasFocus()) {
        logViolation('window_blur', 'Window lost focus - possible app switching');
      }
    };

    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement;
      setIsFullscreen(isFullscreenNow);
      
      if (!isFullscreenNow && isExamActive) {
        logViolation('fullscreen_exit', 'Exited fullscreen mode');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect common copy/paste attempts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'c') {
          logViolation('copy_attempt', 'Attempted to copy content');
          e.preventDefault();
        } else if (e.key === 'v') {
          logViolation('paste_attempt', 'Attempted to paste content');
          e.preventDefault();
        }
      }
      
      // Detect F12, Ctrl+Shift+I (Developer Tools)
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        logViolation('copy_attempt', 'Attempted to open developer tools');
        e.preventDefault();
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      logViolation('copy_attempt', 'Attempted to access context menu');
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      
      if (violationTimeoutRef.current) {
        clearTimeout(violationTimeoutRef.current);
      }
    };
  }, [isExamActive]);

  useEffect(() => {
    const currentlySecure = warningCount < MAX_WARNINGS && isTabActive;
    setIsSecure(currentlySecure);
    onSecurityStatusChange?.(currentlySecure);
  }, [warningCount, isTabActive, onSecurityStatusChange]);

  const logViolation = (type: SecurityViolation['type'], description: string) => {
    const violation: SecurityViolation = {
      id: `violation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      description
    };

    setViolations(prev => [violation, ...prev].slice(0, 10)); // Keep last 10 violations
    setWarningCount(prev => prev + 1);
    setLastViolationTime(new Date());
    
    onViolation?.(violation);

    // Show toast notification
    toast({
      title: "Security Warning",
      description: `${description} (Warning ${warningCount + 1}/${MAX_WARNINGS})`,
      variant: "destructive",
    });

    // Auto-clear violation status after some time
    if (violationTimeoutRef.current) {
      clearTimeout(violationTimeoutRef.current);
    }
    
    violationTimeoutRef.current = setTimeout(() => {
      setLastViolationTime(null);
    }, 5000);
  };

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
      toast({
        title: "Fullscreen Error",
        description: "Unable to enter fullscreen mode",
        variant: "destructive",
      });
    }
  };

  const getViolationTypeIcon = (type: SecurityViolation['type']) => {
    switch (type) {
      case 'tab_switch':
      case 'window_blur':
        return <EyeOff className="h-3 w-3" />;
      case 'fullscreen_exit':
        return <Shield className="h-3 w-3" />;
      case 'copy_attempt':
      case 'paste_attempt':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <AlertTriangle className="h-3 w-3" />;
    }
  };

  const getViolationTypeColor = (type: SecurityViolation['type']) => {
    switch (type) {
      case 'tab_switch':
      case 'window_blur':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'fullscreen_exit':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'copy_attempt':
      case 'paste_attempt':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!isExamActive) {
    return (
      <Card className={className}>
        <CardContent className="p-4 text-center">
          <Shield className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">Security monitoring inactive</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSecure ? (
            <Shield className="h-5 w-5 text-success" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-destructive" />
          )}
          Security Monitor
          <Badge 
            variant={isSecure ? "default" : "destructive"}
            className={isSecure ? "bg-success/10 text-success border-success/20" : ""}
          >
            {isSecure ? "Secure" : "Alert"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Warning Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Warning Level</span>
            <span className={warningCount >= MAX_WARNINGS ? "text-destructive font-medium" : ""}>
              {warningCount}/{MAX_WARNINGS}
            </span>
          </div>
          <Progress 
            value={(warningCount / MAX_WARNINGS) * 100} 
            className="h-2"
          />
          {warningCount >= MAX_WARNINGS && (
            <p className="text-xs text-destructive">
              ⚠️ Maximum warnings reached. Exam security compromised.
            </p>
          )}
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            {isTabActive ? (
              <Eye className="h-3 w-3 text-success" />
            ) : (
              <EyeOff className="h-3 w-3 text-destructive" />
            )}
            <span>Tab Active: {isTabActive ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className={`h-3 w-3 ${isFullscreen ? 'text-success' : 'text-warning'}`} />
            <span>Fullscreen: {isFullscreen ? "Yes" : "No"}</span>
          </div>
        </div>

        {/* Fullscreen Button */}
        {!isFullscreen && (
          <Button variant="outline" size="sm" onClick={enterFullscreen} className="w-full">
            <Shield className="h-4 w-4 mr-2" />
            Enter Fullscreen
          </Button>
        )}

        {/* Recent Violations */}
        {violations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Violations</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {violations.slice(0, 5).map((violation) => (
                <div 
                  key={violation.id}
                  className="flex items-center gap-2 p-2 rounded border text-xs"
                >
                  <Badge variant="outline" className={`${getViolationTypeColor(violation.type)} text-xs`}>
                    {getViolationTypeIcon(violation.type)}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{violation.description}</p>
                    <p className="text-muted-foreground">
                      {violation.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Violation Timer */}
        {lastViolationTime && (
          <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
            Last violation: {Math.floor((Date.now() - lastViolationTime.getTime()) / 1000)}s ago
          </div>
        )}
      </CardContent>
    </Card>
  );
}