
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { AIProvider } from "@/contexts/AIContext";
import Navbar from "@/components/Navbar";
import AnimatedBackground from "@/components/AnimatedBackground";
import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import CourseUpload from "@/pages/CourseUpload";
import QuizComplete from "@/pages/QuizComplete";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WalletProvider>
        <AccessibilityProvider>
          <CourseProvider>
            <AIProvider>
              <AnimatedBackground />
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/course/upload" element={<CourseUpload />} />
                  <Route path="/course/:id" element={<CourseDetail />} />
                  <Route path="/quiz-complete/:id" element={<QuizComplete />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </AIProvider>
          </CourseProvider>
        </AccessibilityProvider>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
