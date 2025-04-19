
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Mic, MicOff, X } from "lucide-react";

// Add Web Speech API types without relying on SpeechRecognition type
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceCommandProps {
  onClose: () => void;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({ onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice commands not supported",
        description: "Your browser doesn't support voice commands.",
        variant: "destructive"
      });
      onClose();
      return;
    }

    // Setup SpeechRecognition
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');
      
      setTranscript(transcript);
      
      // Process final result
      if (event.results[0].isFinal) {
        processCommand(transcript.toLowerCase());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [navigate, onClose]);

  const processCommand = (command: string) => {
    console.log("Processing command:", command);
    
    // Navigation commands
    if (command.includes('go to home') || command.includes('open home')) {
      navigate('/');
      onClose();
      toast({ title: "Navigating to Home" });
    } 
    else if (command.includes('go to courses') || command.includes('open courses')) {
      navigate('/courses');
      onClose();
      toast({ title: "Navigating to Courses" });
    } 
    else if (command.includes('go to dashboard') || command.includes('open dashboard')) {
      navigate('/dashboard');
      onClose();
      toast({ title: "Navigating to Dashboard" });
    }
    // Wallet commands
    else if (command.includes('connect wallet')) {
      toast({ title: "Please use the connect wallet button" });
    }
    // Help commands
    else if (command.includes('help') || command.includes('what can I say')) {
      toast({
        title: "Voice Command Help",
        description: "Try saying: 'go to home', 'go to courses', 'go to dashboard'"
      });
    }
    // Close command
    else if (command.includes('close') || command.includes('exit')) {
      onClose();
    }
    // Unknown command
    else {
      toast({
        title: "Command not recognized",
        description: "Try saying 'help' for a list of commands",
        variant: "destructive"
      });
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.abort();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setTranscript("");
      } catch (error) {
        console.error('Error starting recognition', error);
      }
    }
  };

  return (
    <Card className="fixed bottom-20 right-4 w-80 p-4 z-50 shadow-lg border-2 border-chainlearn-purple/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-sm">Voice Commands</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="min-h-24 flex flex-col items-center justify-center gap-4">
        {transcript ? (
          <div className="text-center text-sm">
            <p className="font-medium">I heard:</p>
            <p className="italic">{transcript}</p>
          </div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            {isListening ? "Listening..." : "Press the mic button and speak a command"}
          </div>
        )}
        
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          className={`rounded-full w-12 h-12 ${isListening ? 'animate-pulse' : ''}`}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </Button>
        
        <div className="text-xs text-muted-foreground text-center">
          Try saying: "go to home", "go to courses", "help"
        </div>
      </div>
    </Card>
  );
};

export default VoiceCommand;
