
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourse } from "@/contexts/CourseContext";
import { useWallet } from "@/contexts/WalletContext";
import { ArrowRight, Award, BookOpen, Clock, GraduationCap, BarChart2, Gem, Download, Share2 } from "lucide-react";
import AIChatAssistant from "@/components/AIChatAssistant";
import LearningRoadmap from "@/components/LearningRoadmap";

const Dashboard: React.FC = () => {
  const { courses, userProgress, loading } = useCourse();
  const { account, balance, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Redirect to connect wallet if not connected
  if (!loading && !account) {
    return (
      <div className="container max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access your personal dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-2">
            <Button 
              onClick={connectWallet}
              className="bg-chainlearn-purple hover:bg-chainlearn-purple/90"
            >
              Connect Wallet
            </Button>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            You can also browse available courses without connecting
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  if (loading || !userProgress) {
    return (
      <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  
  // Calculate dashboard statistics
  const getEnrolledCourses = () => {
    return userProgress.enrolledCourses.map(progress => {
      const course = courses.find(c => c.id === progress.courseId);
      return {
        ...progress,
        course
      };
    }).filter(item => item.course);
  };
  
  const enrolledCourses = getEnrolledCourses();
  const completedCourses = enrolledCourses.filter(item => item.completed);
  const nftCertificates = enrolledCourses.filter(item => item.nftMinted);
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Your Learning Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Enrolled Courses</p>
                <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-chainlearn-purple" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Completed Courses</p>
                <p className="text-2xl font-bold">{completedCourses.length}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">NFT Certificates</p>
                <p className="text-2xl font-bold">{nftCertificates.length}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-chainlearn-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">APE Balance</p>
                <p className="text-2xl font-bold">{balance}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Gem className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="roadmap">Learning Roadmap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* User Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Avatar className="h-24 w-24 border-2 border-chainlearn-purple/20">
                  <AvatarFallback className="text-2xl bg-chainlearn-purple/10 text-chainlearn-purple">
                    {account ? account.substring(2, 4).toUpperCase() : "??"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2 text-center sm:text-left">
                  <h2 className="text-xl font-bold">Blockchain Learner</h2>
                  <p className="text-sm text-muted-foreground">
                    Wallet: {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Not Connected"}
                  </p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                    {completedCourses.length > 0 && (
                      <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Course Graduate
                      </Badge>
                    )}
                    {nftCertificates.length > 0 && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        Certificate Holder
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      ApeChain User
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Courses</CardTitle>
              <CardDescription>Your recently accessed courses</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                  <Button 
                    onClick={() => navigate('/courses')}
                    variant="outline"
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses
                    .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
                    .slice(0, 3)
                    .map(item => (
                      <div 
                        key={item.courseId} 
                        className="flex items-start justify-between border rounded-lg p-4 hover:bg-accent/50 cursor-pointer"
                        onClick={() => navigate(`/course/${item.courseId}`)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{item.course?.title}</h3>
                            {item.completed && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.course?.duration}
                            </span>
                            <span className="flex items-center">
                              <BarChart2 className="h-3 w-3 mr-1" />
                              Level: {item.course?.level}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="ghost" 
                onClick={() => setActiveTab("courses")}
                className="w-full"
              >
                View All Courses
              </Button>
            </CardFooter>
          </Card>
          
          {/* Learning Roadmap Card (abbreviated version) */}
          {enrolledCourses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Path</CardTitle>
                <CardDescription>AI-generated learning roadmap</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-center py-4">
                  <Button 
                    onClick={() => setActiveTab("roadmap")} 
                    className="bg-chainlearn-purple hover:bg-chainlearn-purple/90"
                  >
                    Generate Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>All courses you're enrolled in</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet</p>
                  <Button 
                    onClick={() => navigate('/courses')}
                    variant="outline"
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map(item => (
                    <div 
                      key={item.courseId} 
                      className="flex items-start justify-between border rounded-lg p-4 hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate(`/course/${item.courseId}`)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.course?.imageUrl} 
                            alt={item.course?.title} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{item.course?.title}</h3>
                            {item.completed && (
                              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                Completed
                              </Badge>
                            )}
                            {item.nftMinted && (
                              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                <Award className="h-3 w-3 mr-1" />
                                <span>Certificate Earned</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{item.course?.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {item.course?.duration}
                            </span>
                            <span className="flex items-center">
                              <BarChart2 className="h-3 w-3 mr-1" />
                              Level: {item.course?.level}
                            </span>
                            {item.quizScore !== undefined && (
                              <span className="flex items-center">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                Quiz Score: {item.quizScore}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="shrink-0"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => navigate('/courses')}
                className="w-full"
              >
                Browse More Courses
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="certificates">
          <Card>
            <CardHeader>
              <CardTitle>NFT Certificates</CardTitle>
              <CardDescription>Your earned blockchain certificates</CardDescription>
            </CardHeader>
            <CardContent>
              {nftCertificates.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">
                    You haven't earned any NFT certificates yet. Complete course quizzes to earn certificates.
                  </p>
                  <Button 
                    onClick={() => navigate('/courses')}
                    variant="outline"
                  >
                    Browse Courses
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {nftCertificates.map(item => {
                    const course = courses.find(c => c.id === item.courseId);
                    return (
                      <Card key={item.courseId} className="overflow-hidden border-2 border-chainlearn-purple/20">
                        <div className="relative aspect-[4/3] bg-gradient-to-br from-chainlearn-purple to-chainlearn-pink p-0.5 rounded-t-lg overflow-hidden">
                          <div className="absolute inset-0 bg-white dark:bg-gray-900 m-px rounded-t-[calc(0.5rem-1px)]"></div>
                          
                          <div className="absolute inset-0 m-px rounded-t-[calc(0.5rem-1px)] p-4 flex flex-col items-center justify-center">
                            <Award className="h-10 w-10 text-chainlearn-purple mb-2" />
                            <h3 className="text-base font-bold text-center">Certificate of Completion</h3>
                            <p className="text-xs text-center text-muted-foreground">ApeChain Blockchain Academy</p>
                            <div className="my-3">
                              <p className="text-xs text-center text-muted-foreground">Awarded to</p>
                              <p className="text-sm font-medium text-center">
                                {account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Wallet"}
                              </p>
                            </div>
                            <p className="text-base font-bold text-center mt-1">
                              {course?.title}
                            </p>
                          </div>
                        </div>
                        
                        <CardFooter className="flex justify-between p-4">
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.lastAccessed).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roadmap">
          {userProgress ? <LearningRoadmap userProgress={userProgress} /> : null}
        </TabsContent>
      </Tabs>
      
      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
};

export default Dashboard;
