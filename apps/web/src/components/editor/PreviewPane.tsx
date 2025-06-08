"use client";

import { useState, useEffect, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface PreviewPaneProps {
  latexContent?: string;
}

export function PreviewPane({ latexContent }: PreviewPaneProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  const generatePreview = useCallback(async (content: string) => {
    if (!content.trim()) {
      setPdfUrl(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ latexContent: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate preview");
      }

      if (!data.pdf) {
        throw new Error("No PDF data received");
      }

      // Convert base64 to Blob
      const byteCharacters = atob(data.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const pdfBlob = new Blob([byteArray], { type: "application/pdf" });

      // Create object URL
      const url = URL.createObjectURL(pdfBlob);

      // Clean up previous URL if exists
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      setObjectUrl(url);
      setPdfUrl(url);
      toast.success("Preview generated successfully");
    } catch (err) {
      console.error("Error generating preview:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      toast.error("Failed to generate preview", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (latexContent) {
      const timer = setTimeout(() => {
        generatePreview(latexContent);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [latexContent, generatePreview]);

  const handleRefresh = () => {
    if (latexContent && !isLoading) {
      generatePreview(latexContent);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `resume-preview-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    }
  };

  return (
    <div className="h-full p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Preview</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || !latexContent?.trim()}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!pdfUrl || isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 relative">
        {isLoading ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <p className="text-muted-foreground">Generating preview...</p>
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="text-destructive">Error generating preview</p>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            title="Resume Preview"
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground p-4 text-center">
            <p>Edit your LaTeX to see a preview</p>
            {latexContent && (
              <p className="text-sm text-muted-foreground/70">
                No preview generated yet. Click to generate one.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
