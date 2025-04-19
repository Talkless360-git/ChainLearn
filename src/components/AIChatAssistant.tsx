
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, X, ChevronUp, SendHorizontal, Volume2 } from "lucide-react";
import { useAI, Message } from "@/contexts/AIContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

interface AIChatAssistantProps {
  showByDefault?: boolean;
}

const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ 
  showByDefault = false 
}) => {
  const [isOpen, setIsOpen] = useState(showByDefault);
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useAI();
  const { speakText, textToSpeechEnabled } = useAccessibility();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    await sendMessage(input);
    setInput("");
  };

  const handleSpeakMessage = (content: string) => {
    if (textToSpeechEnabled) {
      speakText(content);
    }
  };

  return (
    <>
      {/* Floating button when chat is minimized */}
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg z-30"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Chat window when open */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-[350px] h-[500px] shadow-lg z-30 flex flex-col">
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 border-b">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-chainlearn-purple" />
              <h3 className="font-medium text-sm">AI Learning Assistant</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-7 w-7 p-0">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-3 flex-grow overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "bg-chainlearn-purple text-white"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>{message.content}</div>
                        {message.role === "assistant" && textToSpeechEnabled && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 -mr-1 -mt-1 text-muted-foreground hover:text-foreground"
                            onClick={() => handleSpeakMessage(message.content)}
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Textarea
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-10 resize-none"
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <SendHorizontal className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default AIChatAssistant;
