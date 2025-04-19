
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@/contexts/WalletContext";
import { uploadCourseToContract } from "@/utils/courseContract";
import type { CourseUploadData } from "@/types/course";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  imageUrl: z.string().url("Must be a valid URL"),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  price: z.string().regex(/^\d*\.?\d*$/, "Must be a valid number"),
  modules: z.array(z.object({
    title: z.string().min(3, "Module title must be at least 3 characters"),
    content: z.string().min(50, "Module content must be at least 50 characters")
  })).min(1, "At least one module is required")
});

const CourseUpload: React.FC = () => {
  const navigate = useNavigate();
  const { account, connectWallet, isCorrectNetwork, switchNetwork } = useWallet();

  const form = useForm<CourseUploadData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      duration: "",
      level: "Beginner",
      price: "0.1",
      modules: [{ title: "", content: "" }]
    }
  });

  const onSubmit = async (data: CourseUploadData) => {
    if (!account) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to upload a course",
        variant: "destructive"
      });
      return;
    }

    if (!isCorrectNetwork) {
      toast({
        title: "Wrong Network",
        description: "Please switch to ApeChain testnet",
        variant: "destructive"
      });
      await switchNetwork();
      return;
    }

    try {
      const success = await uploadCourseToContract(data);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Course uploaded successfully",
        });
        navigate('/courses');
      } else {
        throw new Error("Failed to upload course");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload course. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addModule = () => {
    const currentModules = form.getValues("modules");
    form.setValue("modules", [...currentModules, { title: "", content: "" }]);
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Upload New Course</h1>
        <p className="text-muted-foreground mt-2">
          Share your knowledge with the community. Token payment required for upload.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter course title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter course description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 4 weeks" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price (in APE tokens)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {form.watch("modules").map((_, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <h3 className="font-medium">Module {index + 1}</h3>
              <FormField
                control={form.control}
                name={`modules.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`modules.${index}.content`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Content</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addModule}
            className="w-full"
          >
            Add Module
          </Button>

          <Button 
            type="submit" 
            className="w-full"
            disabled={!account || !isCorrectNetwork}
          >
            {!account ? "Connect Wallet to Upload" : "Upload Course"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CourseUpload;
