import { useState, useEffect, useRef } from "react";
import { Camera, CameraOff, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CameraAccessProps {
  onCameraStatusChange?: (isActive: boolean) => void;
  className?: string;
}

export function CameraAccess({ onCameraStatusChange, className }: CameraAccessProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check initial camera permission status
    checkCameraPermission();
    
    return () => {
      stopCamera();
    };
  }, []);

  useEffect(() => {
    onCameraStatusChange?.(isCameraActive);
  }, [isCameraActive, onCameraStatusChange]);

  const checkCameraPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
      
      permission.onchange = () => {
        setPermissionStatus(permission.state as 'prompt' | 'granted' | 'denied');
      };
    } catch (error) {
      console.warn('Permission API not supported');
    }
  };

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setPermissionStatus('granted');
        
        toast({
          title: "Camera activated",
          description: "Camera is now monitoring for exam security",
        });
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      let errorMessage = 'Failed to access camera';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please enable camera permissions.';
        setPermissionStatus('denied');
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      }
      
      setCameraError(errorMessage);
      setIsCameraActive(false);
      
      toast({
        title: "Camera error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraActive(false);
    
    toast({
      title: "Camera deactivated",
      description: "Camera monitoring has been stopped",
    });
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Exam Monitoring
          <Badge 
            variant={isCameraActive ? "default" : "secondary"} 
            className={isCameraActive ? "bg-success/10 text-success border-success/20" : ""}
          >
            {isCameraActive ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
          {isCameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <CameraOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Camera monitoring disabled</p>
              </div>
            </div>
          )}
        </div>

        {cameraError && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            <AlertTriangle className="h-4 w-4" />
            {cameraError}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p>Permission: <span className="capitalize font-medium">{permissionStatus}</span></p>
            <p className="text-xs mt-1">Camera monitoring helps ensure exam integrity</p>
          </div>
          
          <Button 
            variant={isCameraActive ? "destructive" : "default"}
            onClick={toggleCamera}
            disabled={permissionStatus === 'denied'}
          >
            {isCameraActive ? (
              <>
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Camera
              </>
            ) : (
              <>
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </>
            )}
          </Button>
        </div>

        {permissionStatus === 'denied' && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">Camera access is blocked</p>
            <p>To enable camera monitoring:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Click the camera icon in your browser's address bar</li>
              <li>Select "Allow" for camera access</li>
              <li>Refresh the page if needed</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}