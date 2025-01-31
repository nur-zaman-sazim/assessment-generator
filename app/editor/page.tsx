"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Save, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { readStreamableValue } from "ai/rsc";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { generate } from "../action";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import "react-syntax-highlighter/dist/cjs/styles/prism/vsc-dark-plus";

export const maxDuration = 30;

const slideIn = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function EditorPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [generation, setGeneration] = useState("");

  useEffect(() => {
    const savedContent = localStorage.getItem("assessment-content");
    if (savedContent) {
      setGeneration(savedContent);
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    localStorage.setItem("assessment-content", generation);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleExport = () => {
    const blob = new Blob([generation || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "assessment.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerate = async () => {
    const config = JSON.parse(
      localStorage?.getItem("assessment-config") ||
        JSON.stringify({
          apiKey: "",
          businessTheme: "",
          frontend: "React/Next.js with RTK Query/React Query",
          backend: "NestJS",
          database: "Postgres with Prisma ORM",
          uiFramework: "ShadCn",
          formLibrary: "React Hook Form",
        })
    );
    if (!config.apiKey) {
      alert("Please enter your API key. from config");
      router.push("/");
      return;
    }
    setGeneration("");
    handleSave();

    const { output } = await generate(config);
    for await (const delta of readStreamableValue(output)) {
      setGeneration((currentGeneration) => `${currentGeneration}${delta}`);
    }
  };

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, "")}
          </SyntaxHighlighter>
        </motion.div>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    table({ children }: any) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="overflow-x-auto"
        >
          <table className="min-w-full border-collapse border border-gray-200">
            {children}
          </table>
        </motion.div>
      );
    },
    th({ children }: any) {
      return (
        <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return <td className="border border-gray-300 px-4 py-2">{children}</td>;
    },
    blockquote({ children }: any) {
      return (
        <motion.blockquote
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="border-l-4 border-primary pl-4 italic my-4 text-gray-600"
        >
          {children}
        </motion.blockquote>
      );
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="container flex h-14 items-center">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Configuration
          </Button>
          <div className="ml-auto flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Button
                onClick={handleGenerate}
                className="relative overflow-hidden"
              >
                <span className="relative z-10">Start Generation</span>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 10, opacity: 0 }}
                  className="absolute inset-0 bg-primary/10"
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={generation ? "content" : "empty"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto p-4 w-full max-w-6xl"
            >
              <ReactMarkdown
                components={MarkdownComponents}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                className="space-y-4"
              >
                {generation}
              </ReactMarkdown>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
