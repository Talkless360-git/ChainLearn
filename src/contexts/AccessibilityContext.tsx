
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  largeText: boolean;
  toggleLargeText: () => void;
  dyslexicFont: boolean;
  toggleDyslexicFont: () => void;
  textToSpeechEnabled: boolean;
  toggleTextToSpeech: () => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(false);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState<boolean>(false);

  // Load saved settings from localStorage on initial render
  useEffect(() => {
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedLargeText = localStorage.getItem('largeText') === 'true';
    const savedDyslexicFont = localStorage.getItem('dyslexicFont') === 'true';
    const savedTextToSpeech = localStorage.getItem('textToSpeechEnabled') === 'true';

    setHighContrast(savedHighContrast);
    setLargeText(savedLargeText);
    setDyslexicFont(savedDyslexicFont);
    setTextToSpeechEnabled(savedTextToSpeech);
  }, []);

  // Apply classes to body based on accessibility settings
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (largeText) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }

    if (dyslexicFont) {
      document.body.classList.add('dyslexic-font');
    } else {
      document.body.classList.remove('dyslexic-font');
    }

    // Save settings to localStorage
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('largeText', largeText.toString());
    localStorage.setItem('dyslexicFont', dyslexicFont.toString());
    localStorage.setItem('textToSpeechEnabled', textToSpeechEnabled.toString());
  }, [highContrast, largeText, dyslexicFont, textToSpeechEnabled]);

  // Toggle functions
  const toggleHighContrast = () => setHighContrast(prev => !prev);
  const toggleLargeText = () => setLargeText(prev => !prev);
  const toggleDyslexicFont = () => setDyslexicFont(prev => !prev);
  const toggleTextToSpeech = () => setTextToSpeechEnabled(prev => !prev);

  // Text-to-speech functionality
  const speakText = (text: string) => {
    if (textToSpeechEnabled && window.speechSynthesis) {
      // Stop any current speech
      stopSpeaking();

      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        largeText,
        toggleLargeText,
        dyslexicFont,
        toggleDyslexicFont,
        textToSpeechEnabled,
        toggleTextToSpeech,
        speakText,
        stopSpeaking
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
