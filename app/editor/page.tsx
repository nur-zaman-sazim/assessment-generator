"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { readStreamableValue } from "ai/rsc";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { generate } from "../action";

export const maxDuration = 30;

export default function EditorPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [generation, setGeneration] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Your assessment content will appear here...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      localStorage.setItem("assessment-content", content);
    },
  });

  useEffect(() => {
    if (editor && generation) {
      editor.commands.setContent(generation);
    }
  }, [generation, editor]);

  useEffect(() => {
    const savedContent = localStorage.getItem("assessment-content");
    if (savedContent && editor) {
      editor.commands.setContent(savedContent);
    }
  }, [editor]);

  const handleSave = async () => {
    setIsSaving(true);
    const content = editor?.getHTML();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleExport = () => {
    const content = editor?.getHTML();
    const blob = new Blob([content || ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assessment.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    const prompt = `Generate a technical assessment for a full-stack developer position with the following requirements:
    - Focus on practical, real-world scenarios
    - Include both frontend and backend tasks
    - Add system design considerations
    - Include code review exercises
    Please format the response in markdown.`;

    const { output } = await generate(prompt);

    for await (const delta of readStreamableValue(output)) {
      console.log(generation);
      setGeneration((currentGeneration) => `${currentGeneration}${delta}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 items-center">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Configuration
          </Button>
          <div className="ml-auto flex items-center space-x-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-end">
            <Button
              onClick={handleGenerate}
              className="transition-all duration-200"
            >
              Generate Content
            </Button>
          </div>

          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
            <EditorContent editor={editor} />
          </div>
        </motion.div>
      </main>
    </div>
  );
}
