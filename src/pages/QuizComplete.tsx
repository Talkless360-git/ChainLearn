
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCourse } from "@/contexts/CourseContext";
import { useWallet } from "@/contexts/WalletContext";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { CheckCircle, ArrowRight, Award, Download, Share2 } from "lucide-react";
import confetti from 'canvas-confetti';

const QuizComplete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { courses, userProgress, markNftMinted, hasNft } = useCourse();
  const { account } = useWallet();
  const { speakText, textToSpeechEnabled } = useAccessibility();
  
  const [course, setCourse] = useState<any>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Check if user is eligible for certificate
  useEffect(() => {
    if (!id || !account || !userProgress) {
      navigate('/courses');
      return;
    }
    
    // Find course
    const foundCourse = courses.find(c => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Check if NFT is already minted
      if (hasNft(id)) {
        setIsMinted(true);
      }
      
      // Fire confetti effect
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 500);
      
      // Text to speech celebration
      if (textToSpeechEnabled) {
        speakText("Congratulations! You've completed the course and earned your certificate NFT.");
      }
    } else {
      navigate('/courses');
    }
  }, [id, account, userProgress, courses, navigate, hasNft, speakText, textToSpeechEnabled]);
  
  // Handle NFT minting
  const handleMintNFT = async () => {
    if (!course || !account) return;
    
    setIsMinting(true);
    
    try {
      // Simulate blockchain interaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update local state to record NFT as minted
      markNftMinted(course.id);
      setIsMinted(true);
      
      // Fire confetti again
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 }
      });
      
      if (textToSpeechEnabled) {
        speakText("Certificate NFT successfully minted! It's now on the blockchain permanently.");
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
    } finally {
      setIsMinting(false);
    }
  };
  
  // Redirect to dashboard after delay
  const handleGoToDashboard = () => {
    setIsRedirecting(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 500);
  };
  
  if (!course) {
    return null;
  }
  
  return (
    <div className="container max-w-xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <Card className="border-2 border-green-500 dark:border-green-600">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Course Completed!</CardTitle>
          <CardDescription>You've successfully mastered {course.title}</CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4 py-6">
          {/* Certificate Preview */}
          <div className="relative mx-auto w-full max-w-sm aspect-[4/3] bg-gradient-to-br from-chainlearn-purple via-chainlearn-pink to-chainlearn-blue p-0.5 rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-white dark:bg-gray-900 m-px rounded-[calc(0.5rem-1px)]"></div>
            
            <div className="absolute inset-0 m-px rounded-[calc(0.5rem-1px)] p-6 flex flex-col justify-between">
              <div className="text-center pt-4">
                <div className="flex justify-center mb-2">
                  <Award className="h-12 w-12 text-chainlearn-purple" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Certificate of Completion</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">ApeChain Blockchain Academy</p>
              </div>
              
              <div className="space-y-1 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">This certifies that</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Wallet"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">has successfully completed</p>
                <p className="text-md font-bold text-gray-900 dark:text-white">
                  {course.title}
                </p>
              </div>
              
              <div className="text-center pb-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Verified on ApeChain • {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isMinted 
                ? "Your certificate is now permanently recorded on the blockchain." 
                : "Mint your certificate as an NFT to showcase your achievement on the blockchain."}
            </p>
            
            <div className="flex justify-center space-x-2 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                Course Completed
              </span>
              <span>•</span>
              <span className="flex items-center">
                <span className={`inline-block h-2 w-2 rounded-full ${isMinted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} mr-1`}></span>
                {isMinted ? 'NFT Minted' : 'Ready to Mint'}
              </span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3">
          {!isMinted ? (
            <Button 
              onClick={handleMintNFT} 
              disabled={isMinting}
              className="w-full bg-chainlearn-purple hover:bg-chainlearn-purple/90"
            >
              {isMinting ? (
                <>
                  <span className="mr-2">Minting NFT</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                <>
                  <Award className="mr-2 h-4 w-4" />
                  <span>Mint Certificate NFT</span>
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3 w-full">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
              
              <Button 
                onClick={handleGoToDashboard} 
                disabled={isRedirecting}
                className="w-full bg-chainlearn-blue hover:bg-chainlearn-blue/90"
              >
                <span>View in Dashboard</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Link to="/courses" className="text-sm text-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            Back to All Courses
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizComplete;
