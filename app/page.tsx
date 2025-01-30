"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Wand2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion } from "framer-motion";

const formSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  businessTheme: z.string().min(1, "Business Problem Theme is required"),
  uiFramework: z.string().min(1, "UI Framework is required"),
  formLibrary: z.string().min(1, "Form Library is required"),
});

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function Home() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
      businessTheme: "",
      uiFramework: "",
      formLibrary: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Store values in localStorage for persistence
      localStorage.setItem('assessment-config', JSON.stringify(values));
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push("/editor");
    } catch (error) {
      console.error("Error generating assessment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-background to-muted p-6"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          variants={itemVariants}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Assessment Generator
          </h1>
          <p className="text-muted-foreground text-lg">
            Generate comprehensive technical assessments powered by AI
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>OpenAI API Key</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showApiKey ? "text" : "password"}
                              placeholder="Enter your API key"
                              {...field}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent"
                              onClick={() => setShowApiKey(!showApiKey)}
                            >
                              {showApiKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessTheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Problem Theme</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., E-commerce Platform, CRM System"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div
                    variants={itemVariants}
                    className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border/50"
                  >
                    <h3 className="font-semibold">Technology Stack</h3>
                    
                    <div className="space-y-2">
                      <Label>Frontend</Label>
                      <Input
                        value="React/Next.js with RTK Query/React Query"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Backend</Label>
                      <Input value="NestJS" disabled />
                    </div>

                    <div className="space-y-2">
                      <Label>Database</Label>
                      <Input value="Postgres with Prisma ORM" disabled />
                    </div>

                    <FormField
                      control={form.control}
                      name="uiFramework"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UI Framework</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select UI Framework" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="mantine">Mantine</SelectItem>
                              <SelectItem value="mui">Material UI</SelectItem>
                              <SelectItem value="bootstrap">Bootstrap</SelectItem>
                              <SelectItem value="custom">Custom CSS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="formLibrary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Form Library</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Form Library" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="react-hook-form">
                                React Hook Form
                              </SelectItem>
                              <SelectItem value="formik">Formik</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Assessment
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.main>
  );
}