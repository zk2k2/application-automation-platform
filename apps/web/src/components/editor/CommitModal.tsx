"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, Loader2 } from "lucide-react";

interface CommitModalProps {
  isOpen: boolean;
  onClose: () => void;
  latexContent: string;
}

export function CommitModal({
  isOpen,
  onClose,
  latexContent,
}: CommitModalProps) {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [shareableUrl, setShareableUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleGetLink = async () => {
    if (!latexContent) {
      toast.error("No resume content to commit");
      return;
    }

    setIsLoading(true);
    setShareableUrl("");

    try {
      const now = new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d+Z$/, "Z");

      let commitMessage = "Update resume at " + now;
      if (companyName && position) {
        commitMessage = `Applying to ${companyName} as ${position} at ${now}`;
      } else if (companyName) {
        commitMessage = `Applying to ${companyName} at ${now}`;
      } else if (position) {
        commitMessage = `Applying as ${position} at ${now}`;
      }

      const response = await fetch("/api/commit-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latexContent, commitMessage }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get shareable link");
      }
      if (!data.shortUrl) {
        throw new Error("No URL returned from server");
      }

      setShareableUrl(data.shortUrl);
      toast.success("Shareable link generated!");
    } catch (error) {
      console.error("Error generating link:", error);
      toast.error(
        "Failed to get shareable link" +
          (error instanceof Error ? `: ${error.message}` : "")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToApply = () => {
    window.location.href = "/apply";
  };

  const handleCopy = () => {
    if (!shareableUrl) return;
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => toast.success("Link copied to clipboard"))
      .catch(() => toast.error("Failed to copy link"));
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-600 transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div
          className={`bg-white p-6 rounded-lg shadow-lg transform transition-all duration-300 ${
            isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
          } w-full max-w-md`}
        >
          <h2 className="text-2xl font-semibold mb-4">Applying somewhere?</h2>
          <p className="mb-4">
            Commit your resume changes and get a short shareable URL!
          </p>

          {shareableUrl ? (
            <>
              <p className="mb-2">Your shareable link:</p>
              <div className="flex items-center gap-2 mb-4">
                <Input
                  value={shareableUrl}
                  readOnly
                  className="w-full"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button variant="outline" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>
              <Button onClick={navigateToApply} className="w-full my-2">
                Write an e-mail
              </Button>
              <Button onClick={onClose} variant="outline" className="w-full">
                Close
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Company you're applying to (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mb-4"
                onKeyDown={(e) => e.key === "Enter" && handleGetLink()}
              />
              <Input
                placeholder="Position title (optional)"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="mb-4"
                onKeyDown={(e) => e.key === "Enter" && handleGetLink()}
              />

              <div className="flex gap-2 justify-end">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleGetLink} disabled={isLoading}>
                  Get Link
                </Button>
              </div>

              {isLoading && (
                <div className="mt-4 flex items-center text-gray-600">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>This may take a moment...</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
