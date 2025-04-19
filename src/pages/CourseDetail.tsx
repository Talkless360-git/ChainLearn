import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useCourse, Course, QuizQuestion } from "@/contexts/CourseContext";
import { useWallet } from "@/contexts/WalletContext";
import { useAI } from "@/contexts/AIContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { Clock, BookOpen, HelpCircle, AlertCircle, ChevronRight, Award } from "lucide-react";
import AIChatAssistant from "@/components/AIChatAssistant";
import { Button as ShadcnButton } from "@/components/ui/button";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, loading, enrollInCourse, isEnrolled, updateQuizResults, hasPassed, getQuizForCourse } = useCourse();
  const { account, connectWallet, isConnecting } = useWallet();
  const { getQuizHelp } = useAI();
  const { speakText } = useAccessibility();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [helpText, setHelpText] = useState<string | null>(null);
  const [showingHelp, setShowingHelp] = useState(false);
  
  // Find the course by ID
  useEffect(() => {
    if (!loading && id) {
      const foundCourse = courses.find(c => c.id === id);
      if (foundCourse) {
        setCourse(foundCourse);
      }
    }
  }, [id, courses, loading]);
  
  // Load quiz questions
  useEffect(() => {
    if (course && id) {
      const quiz = getQuizForCourse(id);
      
      if (quiz) {
        setQuizQuestions(quiz.questions);
        setSelectedAnswers(new Array(quiz.questions.length).fill(-1));
      }
    }
  }, [course, id, getQuizForCourse]);
  
  // Enroll in course
  const handleEnroll = () => {
    if (!account) {
      connectWallet();
      return;
    }
    
    if (course) {
      enrollInCourse(course.id);
      // Switch to content tab after enrollment
      setActiveTab("content");
    }
  };
  
  // Start the quiz
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    setQuizCompleted(false);
    setScore(0);
  };
  
  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setHelpText(null);
      setShowingHelp(false);
    } else {
      // Calculate score and complete quiz
      const correctAnswers = selectedAnswers.reduce((count, answer, index) => {
        return answer === quizQuestions[index].correctAnswer ? count + 1 : count;
      }, 0);
      
      const finalScore = Math.round((correctAnswers / quizQuestions.length) * 100);
      setScore(finalScore);
      setQuizCompleted(true);
      
      // Update course progress
      if (course) {
        const passed = finalScore >= 80;
        updateQuizResults(course.id, finalScore, passed);
        
        // If passed, navigate to quiz complete page
        if (passed) {
          setTimeout(() => {
            navigate(`/quiz-complete/${course.id}`);
          }, 3000);
        }
      }
    }
  };
  
  // Get help for current question
  const handleGetHelp = async () => {
    if (quizQuestions.length > 0) {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const help = await getQuizHelp(currentQuestion.id);
      setHelpText(help);
      setShowingHelp(true);
      
      // Read help text aloud
      speakText(help);
    }
  };
  
  // Reset quiz
  const handleResetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(quizQuestions.length).fill(-1));
    setQuizCompleted(false);
    setScore(0);
    setHelpText(null);
    setShowingHelp(false);
  };
  
  if (loading || !course) {
    return (
      <div className="container max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="md:col-span-3">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const isUserEnrolled = isEnrolled(course.id);
  const userPassed = hasPassed(course.id);
  const currentQuestion = quizQuestions[currentQuestionIndex];
  
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          
          {!isUserEnrolled ? (
            <Button 
              onClick={handleEnroll} 
              disabled={isConnecting}
              className="bg-chainlearn-purple hover:bg-chainlearn-purple/90"
            >
              {!account ? "Connect Wallet to Enroll" : "Enroll Now"}
            </Button>
          ) : userPassed ? (
            <Badge className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm">
              <Award className="h-4 w-4 mr-1" />
              Course Completed
            </Badge>
          ) : (
            <Button 
              onClick={() => setActiveTab("quiz")}
              className="bg-chainlearn-blue hover:bg-chainlearn-blue/90"
            >
              Take Quiz
            </Button>
          )}
        </div>
        
        <p className="text-muted-foreground mb-4">
          {course.description}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{course.duration}</span>
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{course.modules.length} Modules</span>
          </Badge>
          
          <Badge 
            variant="outline" 
            className={`px-2 py-1 ${
              course.level === "Beginner" 
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                : course.level === "Intermediate"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
            }`}
          >
            {course.level}
          </Badge>
        </div>
      </div>
      
      {/* Course Content and Quiz */}
      <Tabs 
        defaultValue="content" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Course Content</TabsTrigger>
          <TabsTrigger value="quiz" disabled={!isUserEnrolled}>Quiz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Course Image */}
              <div className="md:col-span-1 order-1 md:order-2">
                <Card>
                  <div className="p-1">
                    <img 
                      src={course.imageUrl} 
                      alt={course.title} 
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <CardContent className="p-4">
                    {!isUserEnrolled ? (
                      <Button 
                        onClick={handleEnroll} 
                        className="w-full bg-chainlearn-purple hover:bg-chainlearn-purple/90"
                      >
                        {!account ? "Connect Wallet to Enroll" : "Enroll Now"}
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Progress</span>
                            <span>{userPassed ? "Completed" : "In Progress"}</span>
                          </div>
                          <Progress value={userPassed ? 100 : 50} className="h-2" />
                        </div>
                        <Button 
                          onClick={() => setActiveTab("quiz")} 
                          className="w-full bg-chainlearn-blue hover:bg-chainlearn-blue/90"
                        >
                          {userPassed ? "Retake Quiz" : "Take Quiz"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Course Modules */}
              <div className="md:col-span-2 order-2 md:order-1">
                <div className="space-y-6">
                  {course.modules.map((module, index) => (
                    <Card key={module.id}>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-3">
                          Module {index + 1}: {module.title}
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <p>{module.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="quiz">
          <Card>
            <CardContent className="p-6">
              {!quizStarted ? (
                /* Quiz Start Screen */
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-4">Course Quiz</h2>
                  <p className="mb-6 text-muted-foreground max-w-md mx-auto">
                    Test your knowledge to earn your blockchain certificate. Score at least 80% to pass and mint your NFT.
                  </p>
                  <Button 
                    onClick={handleStartQuiz}
                    className="bg-chainlearn-purple hover:bg-chainlearn-purple/90"
                  >
                    Start Quiz
                  </Button>
                </div>
              ) : quizCompleted ? (
                /* Quiz Results Screen */
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
                  <div className="mb-6">
                    <div className="text-5xl font-bold mb-2">{score}%</div>
                    <p className="text-lg">
                      {score >= 80 ? (
                        <span className="text-green-600 dark:text-green-400">
                          Congratulations! You passed the quiz.
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400">
                          You didn't reach the passing score of 80%.
                        </span>
                      )}
                    </p>
                  </div>
                  
                  {score >= 80 ? (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Redirecting to certificate minting...
                      </p>
                      <div className="flex justify-center">
                        <div className="w-6 h-6 border-2 border-chainlearn-purple border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleResetQuiz}
                      variant="outline"
                    >
                      Try Again
                    </Button>
                  )}
                </div>
              ) : (
                /* Quiz Questions Screen */
                <div className="max-w-2xl mx-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium">
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleGetHelp}
                      className="text-chainlearn-blue hover:text-chainlearn-blue/90 flex items-center gap-1"
                    >
                      <HelpCircle className="h-4 w-4" />
                      <span>Need Help?</span>
                    </Button>
                  </div>
                  
                  <Progress 
                    value={((currentQuestionIndex + 1) / quizQuestions.length) * 100} 
                    className="h-1 mb-6" 
                  />
                  
                  {currentQuestion && (
                    <div>
                      <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>
                      
                      <RadioGroup
                        value={selectedAnswers[currentQuestionIndex].toString()}
                        onValueChange={(value) => handleAnswerSelect(parseInt(value))}
                        className="space-y-4"
                      >
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <RadioGroupItem 
                              value={index.toString()} 
                              id={`option-${index}`} 
                              className="border-2"
                            />
                            <Label htmlFor={`option-${index}`} className="flex-grow py-2">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      
                      {/* Help Text */}
                      {showingHelp && helpText && (
                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium mb-1">Hint</p>
                              <p className="text-sm">{helpText}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-8 flex justify-end">
                        <Button 
                          onClick={handleNextQuestion}
                          disabled={selectedAnswers[currentQuestionIndex] === -1}
                          className="bg-chainlearn-purple hover:bg-chainlearn-purple/90 flex items-center gap-1"
                        >
                          <span>
                            {currentQuestionIndex < quizQuestions.length - 1 ? "Next Question" : "Complete Quiz"}
                          </span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
};

export default CourseDetail;
