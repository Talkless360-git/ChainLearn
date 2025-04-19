
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Settings, Volume2, Type, Eye, Mic } from "lucide-react";
import VoiceCommand from "./VoiceCommand";

const AccessibilityControls: React.FC = () => {
  const {
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
    dyslexicFont,
    toggleDyslexicFont,
    textToSpeechEnabled,
    toggleTextToSpeech
  } = useAccessibility();
  
  const [showVoiceCommand, setShowVoiceCommand] = useState(false);

  return (
    <div className="relative flex items-center">
      {showVoiceCommand && <VoiceCommand onClose={() => setShowVoiceCommand(false)} />}
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open accessibility menu</span>
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Accessibility Settings</h4>
              <p className="text-sm text-muted-foreground">
                Customize your learning experience
              </p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <Label htmlFor="high-contrast">High Contrast</Label>
                </div>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={toggleHighContrast}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="large-text">Larger Text</Label>
                </div>
                <Switch
                  id="large-text"
                  checked={largeText}
                  onCheckedChange={toggleLargeText}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Type className="h-4 w-4" />
                  <Label htmlFor="dyslexic-font">Dyslexic Font</Label>
                </div>
                <Switch
                  id="dyslexic-font"
                  checked={dyslexicFont}
                  onCheckedChange={toggleDyslexicFont}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <Label htmlFor="text-to-speech">Text to Speech</Label>
                </div>
                <Switch
                  id="text-to-speech"
                  checked={textToSpeechEnabled}
                  onCheckedChange={toggleTextToSpeech}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                  onClick={() => setShowVoiceCommand(true)}
                >
                  <Mic className="h-4 w-4" />
                  <span>Voice Commands</span>
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AccessibilityControls;
