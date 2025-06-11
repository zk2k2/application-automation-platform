"use client";

import { useState, useEffect } from "react";
import Editor from "react-simple-code-editor";
import Prism from "@/prism";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { toast } from "sonner";

interface EditorPaneProps {
  initialContent?: string;
  onContentChange?: (content: string) => void;
}

export function EditorPane({
  initialContent,
  onContentChange,
}: EditorPaneProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedContent = useDebounce(content, 500);

  useEffect(() => {
    const fetchResumeFromGitHub = async () => {
      try {
        const response = await fetch("/api/fetch-resume");

        if (!response.ok) {
          throw new Error(
            `Failed to fetch: ${response.status} ${response.statusText}`
          );
        }

        const resumeContent = await response.text();
        setContent(initialContent || resumeContent);
        toast.success("Successfully fetched resume code from GitHub!", {
          id: "fetch-resume-from-github",
        });
      } catch (err) {
        console.error("Error fetching resume:", err);
        setError(
          `Failed to load resume: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
        setContent(
          initialContent ||
            "\\documentclass{article}\\begin{document}Failed to load resume content\\end{document}"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumeFromGitHub();
  }, [initialContent]);

  useEffect(() => {
    if (!isLoading) {
      onContentChange?.(debouncedContent);
    }
  }, [debouncedContent, onContentChange, isLoading]);

  const highlight = (code: string) =>
    Prism.highlight(code, Prism.languages.latex, "latex");

  if (isLoading) {
    return (
      <div className="h-screen p-4 flex items-center justify-center">
        <div className="text-center">Loading resume content...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen p-4 flex items-center justify-center">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-screen p-4">
      <div className="h-full overflow-y-auto rounded-lg bg-white">
        <Editor
          value={content}
          onValueChange={setContent}
          highlight={highlight}
          padding={10}
          className="font-mono text-sm w-full text-black"
          style={{
            fontFamily: "Fira Code, monospace",
            minHeight: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          textareaId="latex-editor"
        />
      </div>
    </div>
  );
}
