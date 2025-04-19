
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useCourse } from "@/contexts/CourseContext";
import { useWallet } from "@/contexts/WalletContext";
import { Search, Clock, BarChart2, Award, ChevronRight } from "lucide-react";
import AIChatAssistant from "@/components/AIChatAssistant";

const Courses: React.FC = () => {
  const { courses, loading, isEnrolled, hasPassed } = useCourse();
  const { account } = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Filter courses based on search term and active tab
  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "enrolled" && account) return matchesSearch && isEnrolled(course.id);
    if (activeTab === "completed" && account) return matchesSearch && hasPassed(course.id);
    
    return matchesSearch;
  });

  // Get badge color based on course level
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Intermediate":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "Advanced":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blockchain Courses</h1>
          <p className="text-muted-foreground mt-1">Learn, complete quizzes, and earn NFT certificates</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-64"
            />
          </div>
          <Link to="/course/upload">
            <Button>Upload Course</Button>
          </Link>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="enrolled" disabled={!account}>Enrolled</TabsTrigger>
          <TabsTrigger value="completed" disabled={!account}>Completed</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
              <CardHeader>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={() => { setSearchTerm(""); setActiveTab("all"); }}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{course.title}</CardTitle>
                  {account && hasPassed(course.id) && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Completed
                    </Badge>
                  )}
                </div>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className={getLevelBadgeColor(course.level)}>
                    {course.level}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <BarChart2 className="h-3 w-3 mr-1" />
                    {course.modules.length} Modules
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Link to={`/course/${course.id}`} className="w-full">
                  <Button className="w-full flex items-center justify-between group bg-chainlearn-purple hover:bg-chainlearn-purple/90">
                    <span>{account && isEnrolled(course.id) ? "Continue Learning" : "View Course"}</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* AI Chat Assistant */}
      <AIChatAssistant />
    </div>
  );
};

export default Courses;
