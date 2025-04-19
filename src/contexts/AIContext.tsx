
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCourse, Course } from './CourseContext';

interface AIContextType {
  sendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
  generateRoadmap: (courseIds: string[]) => Promise<string>;
  getQuizHelp: (questionId: string) => Promise<string>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

// Helper to generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock responses based on keywords for demo purposes
const getMockResponse = (message: string, courses: Course[]): string => {
  const lowerMessage = message.toLowerCase();
  
  // Course-related questions
  if (lowerMessage.includes("blockchain") && lowerMessage.includes("what")) {
    return "Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping without requiring a trusted third party. It's the foundation of cryptocurrencies like Bitcoin but has many other applications beyond finance.";
  }
  
  if (lowerMessage.includes("smart") && lowerMessage.includes("contract")) {
    return "Smart contracts are self-executing contracts with the terms directly written into code. They automatically enforce and execute agreements when predetermined conditions are met, eliminating the need for intermediaries.";
  }
  
  if (lowerMessage.includes("nft") || lowerMessage.includes("non-fungible")) {
    return "NFTs (Non-Fungible Tokens) are unique digital assets verified using blockchain technology. Unlike cryptocurrencies such as Bitcoin, each NFT has distinct information and properties making it non-interchangeable.";
  }
  
  if (lowerMessage.includes("defi") || lowerMessage.includes("decentralized finance")) {
    return "DeFi (Decentralized Finance) refers to financial applications built on blockchain technologies that don't rely on centralized financial intermediaries. These include lending platforms, decentralized exchanges, and yield farming opportunities.";
  }
  
  // Learning-related questions
  if (lowerMessage.includes("course") && lowerMessage.includes("recommend")) {
    return "Based on your interests, I'd recommend starting with our 'Blockchain Fundamentals' course to build a solid foundation. Then, depending on your goals, you might explore 'Smart Contract Development' or 'NFT Creation and Marketplaces'.";
  }
  
  if (lowerMessage.includes("difficult") || lowerMessage.includes("struggling")) {
    return "Learning blockchain concepts can be challenging at first. I suggest breaking your study into smaller sessions, focusing on practical applications, and joining our community forums to discuss concepts with peers. Would you like me to explain a specific topic in more detail?";
  }
  
  // Fallback responses
  const fallbacks = [
    "That's an interesting question about blockchain technology. To give you the best answer, could you provide a bit more context about what you're trying to learn?",
    "I'm here to help with your blockchain learning journey. Could you elaborate on your question so I can provide more specific guidance?",
    "As your AI learning assistant, I'm continuously improving. For this particular question, I'd need some additional details to give you the most helpful response.",
    "I'd be happy to help with your blockchain studies. To offer the most relevant insights, could you share what course or topic you're currently focusing on?"
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I'm your AI learning assistant. Ask me anything about blockchain, smart contracts, NFTs, or any of your courses.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { courses } = useCourse();

  // Send message to AI assistant (mock implementation)
  const sendMessage = async (content: string): Promise<void> => {
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock response
    const responseContent = getMockResponse(content, courses);
    
    // Add AI response
    const aiResponse: Message = {
      id: generateId(),
      role: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  // Generate learning roadmap for given courses (mock implementation)
  const generateRoadmap = async (courseIds: string[]): Promise<string> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get the course titles for the roadmap
    const selectedCourses = courses.filter(course => courseIds.includes(course.id));
    const courseTitles = selectedCourses.map(course => course.title);
    
    // Generate mock roadmap
    let roadmap = "# Your Personalized Learning Roadmap\n\n";
    
    // Add weeks based on courses
    let currentWeek = 1;
    
    for (const course of selectedCourses) {
      roadmap += `## ${course.title}\n`;
      
      // Add 2 weeks per course (simplified mock)
      for (let i = 0; i < 2; i++) {
        roadmap += `\n### Week ${currentWeek}: ${course.modules[Math.min(i, course.modules.length - 1)].title}\n`;
        roadmap += `* Study core concepts (3 hours)\n`;
        roadmap += `* Complete practice exercises (2 hours)\n`;
        roadmap += `* Join community discussion (1 hour)\n`;
        currentWeek++;
      }
      
      // Add assessment week
      roadmap += `\n### Week ${currentWeek}: Assessment\n`;
      roadmap += `* Review all modules (3 hours)\n`;
      roadmap += `* Take practice quizzes (2 hours)\n`;
      roadmap += `* Complete final assessment (1 hour)\n`;
      currentWeek++;
      
      roadmap += `\n`;
    }
    
    // Add final recommendations
    roadmap += `## Next Steps\n\n`;
    
    if (!courseIds.includes('c003') && !courseIds.includes('c004')) {
      roadmap += `* Consider taking an advanced course like "DeFi Protocols and Tokenomics" to further your knowledge\n`;
    }
    
    roadmap += `* Join blockchain developer communities\n`;
    roadmap += `* Start building your own projects\n`;
    
    setIsLoading(false);
    return roadmap;
  };

  // Get help with a quiz question (mock implementation)
  const getQuizHelp = async (questionId: string): Promise<string> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on question ID
    const helpResponses: Record<string, string> = {
      'q001': "This question is asking about the primary purpose of blockchain technology. Think about what fundamental problem blockchain was designed to solve - the need for trusted intermediaries in digital transactions.",
      'q002': "When considering the consensus mechanism used by Bitcoin, remember that it requires miners to solve complex mathematical problems to validate transactions and create new blocks.",
      'q006': "For Ethereum smart contract development, consider which programming language was specifically created for this purpose.",
      'q011': "Think about how traditional financial services require middlemen like banks, and how DeFi aims to change this model.",
      'q016': "This question is simply asking what the NFT acronym stands for. Remember that these tokens have a special property that makes each one distinct from others."
    };
    
    // Default help message if specific question help is not defined
    const defaultHelp = "For this question, review the key concepts in the course material. Focus on understanding the foundational principles rather than memorizing facts. Think about how this concept relates to the broader blockchain ecosystem.";
    
    setIsLoading(false);
    return helpResponses[questionId] || defaultHelp;
  };

  return (
    <AIContext.Provider
      value={{
        sendMessage,
        messages,
        isLoading,
        generateRoadmap,
        getQuizHelp
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
