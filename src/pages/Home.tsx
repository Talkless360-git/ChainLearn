
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import AIChatAssistant from "@/components/AIChatAssistant";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { BookOpen, Award, Cpu, Bookmark } from "lucide-react";

const Home: React.FC = () => {
  const { account, connectWallet } = useWallet();
  const { speakText, textToSpeechEnabled } = useAccessibility();
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    // Auto-show chat assistant after 3 seconds if text-to-speech is enabled
    if (textToSpeechEnabled) {
      const timer = setTimeout(() => {
        setShowChat(true);
        // Introduce the platform
        speakText("Welcome to ChainLearn, your blockchain education platform. Start your learning journey today.");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [textToSpeechEnabled, speakText]);

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-chainlearn-purple via-chainlearn-pink to-chainlearn-blue animate-pulse-light"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-chainlearn-purple rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-chainlearn-pink rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '-3s' }}></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="block">Learn. Grow. Earn Rewards.</span>
            <span className="block bg-gradient-to-r from-chainlearn-purple via-chainlearn-pink to-chainlearn-blue text-transparent bg-clip-text mt-2">
              Get Certified with NFTs.
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master blockchain concepts, smart contracts, and Web3 development through interactive courses. Earn tokens and mint certificate NFTs to showcase your skills on-chain.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/courses">
              <Button size="lg" className="bg-chainlearn-purple hover:bg-chainlearn-purple/90 text-white px-8">
                Explore Courses
              </Button>
            </Link>
            {!account && (
              <Button variant="outline" size="lg" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
            {account && (
              <Link to="/dashboard">
                <Button variant="outline" size="lg">
                  My Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 bg-chainlearn-purple/10 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-chainlearn-purple" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Courses</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn blockchain concepts through engaging content and interactive quizzes.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 bg-chainlearn-pink/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="h-6 w-6 text-chainlearn-pink" />
            </div>
            <h3 className="text-xl font-semibold mb-2">NFT Certificates</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Earn verifiable on-chain certificates to showcase your blockchain knowledge.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 bg-chainlearn-blue/10 rounded-lg flex items-center justify-center mb-4">
              <Cpu className="h-6 w-6 text-chainlearn-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Learning</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get personalized learning roadmaps and assistance from our AI tutor.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
              <Bookmark className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Token Rewards</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Earn APE tokens for completing courses and participating in the ecosystem.
            </p>
          </div>
        </div>
      </section>
      
      {/* Get Started Section */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-chainlearn-purple to-chainlearn-pink rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to start your blockchain journey?
                <span className="block">Join ChainLearn today.</span>
              </h2>
              <p className="mt-4 text-lg text-purple-100">
                Connect your wallet, enroll in courses, and earn while you learn.
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link to="/courses">
                  <Button size="lg" className="bg-white text-chainlearn-purple hover:bg-gray-50 px-8">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Chat Assistant */}
      <AIChatAssistant showByDefault={showChat} />
    </div>
  );
};

export default Home;
