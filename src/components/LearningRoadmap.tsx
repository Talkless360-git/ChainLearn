
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAI } from "@/contexts/AIContext";
import { Calendar, Book, Award, FileText, RefreshCcw } from "lucide-react";
import { useCourse, UserProgress } from "@/contexts/CourseContext";

interface LearningRoadmapProps {
  userProgress: UserProgress;
}

const LearningRoadmap: React.FC<LearningRoadmapProps> = ({ userProgress }) => {
  const { generateRoadmap, isLoading } = useAI();
  const { courses } = useCourse();
  const [roadmap, setRoadmap] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    
    try {
      // Get IDs of enrolled courses
      const enrolledCourseIds = userProgress.enrolledCourses.map(course => course.courseId);
      
      if (enrolledCourseIds.length === 0) {
        return;
      }
      
      const roadmapText = await generateRoadmap(enrolledCourseIds);
      setRoadmap(roadmapText);
    } catch (error) {
      console.error("Error generating roadmap:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to convert markdown-like headings to JSX
  const formatRoadmap = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const result: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        // Main heading
        result.push(
          <h2 key={`h1-${index}`} className="text-xl font-bold mt-4 mb-2 text-chainlearn-purple">
            {line.substring(2)}
          </h2>
        );
      } else if (line.startsWith('## ')) {
        // Second level heading
        result.push(
          <h3 key={`h2-${index}`} className="text-lg font-semibold mt-3 mb-1">
            {line.substring(3)}
          </h3>
        );
      } else if (line.startsWith('### ')) {
        // Third level heading
        result.push(
          <div key={`h3-${index}`} className="flex items-center mt-3 mb-1">
            <Calendar className="h-4 w-4 mr-2 text-chainlearn-pink" />
            <h4 className="text-md font-medium">{line.substring(4)}</h4>
          </div>
        );
      } else if (line.startsWith('* ')) {
        // List item
        result.push(
          <div key={`li-${index}`} className="flex items-start ml-6 my-1">
            <div className="h-1.5 w-1.5 rounded-full bg-chainlearn-blue mt-1.5 mr-2"></div>
            <span className="text-sm">{line.substring(2)}</span>
          </div>
        );
      } else if (line.trim() === '') {
        // Empty line
        result.push(<div key={`br-${index}`} className="h-2"></div>);
      } else {
        // Regular paragraph
        result.push(
          <p key={`p-${index}`} className="text-sm my-1">
            {line}
          </p>
        );
      }
    });
    
    return result;
  };

  // Get enrolled course titles
  const getEnrolledCourses = () => {
    return userProgress.enrolledCourses.map(progress => {
      const course = courses.find(c => c.id === progress.courseId);
      return course ? course.title : "Unknown Course";
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5 text-chainlearn-purple" />
          <span>Your Learning Roadmap</span>
        </CardTitle>
        <CardDescription>
          AI-generated personalized learning path based on your enrolled courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {userProgress.enrolledCourses.length === 0 ? (
          <div className="text-center py-6">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No courses enrolled</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enroll in courses to get a personalized learning roadmap
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/courses'}>
              Browse Courses
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Enrolled Courses:</h3>
              <div className="flex flex-wrap gap-2">
                {getEnrolledCourses().map((title, i) => (
                  <Badge key={i} variant="outline" className="bg-chainlearn-purple/10">
                    {title}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            {!roadmap ? (
              <div className="text-center py-6">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">Generate Your Roadmap</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let our AI create a personalized learning path based on your enrolled courses
                </p>
                <Button 
                  onClick={handleGenerateRoadmap} 
                  disabled={isGenerating}
                  className="bg-chainlearn-purple hover:bg-chainlearn-purple/90"
                >
                  {isGenerating ? "Generating..." : "Generate Roadmap"}
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute top-0 right-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleGenerateRoadmap} 
                    disabled={isGenerating} 
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="pt-2 pb-4">{formatRoadmap(roadmap)}</div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default LearningRoadmap;
