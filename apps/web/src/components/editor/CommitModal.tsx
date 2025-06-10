"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

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

      const commitMessage = companyName
        ? `Applying to ${companyName} at ${now}`
        : `Update resume at ${now}`;

      const response = await fetch("/api/commit-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latexContent,
          commitMessage,
        }),
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
        className={`fixed inset-0 bg-gray-600 flex items-center justify-center transition-opacity duration-300 ${
          isAnimating ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className={`bg-white p-6 rounded-lg shadow-lg z-10 transform transition-all duration-300 ${
            isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <h2 className="!text-2xl font-semibold mb-4">Applying somewhere?</h2>
          <p className="text-md font-normal mb-4">
            Commit your resume changes and get a short shareable URL!
          </p>

          {shareableUrl ? (
            <div>
              <p className="mb-2">Your shareable link:</p>
              <div className="flex items-center gap-2">
                <Input
                  value={shareableUrl}
                  readOnly
                  className="w-64"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <Button onClick={handleCopy}>Copy</Button>
              </div>
              <Button onClick={onClose} className="mt-4 w-full">
                Close
              </Button>
            </div>
          ) : (
            <div className="">
              <Input
                placeholder="Company you're applying to (optional)"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="mb-4"
                onKeyDown={(e) => e.key === "Enter" && handleGetLink()}
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleGetLink} disabled={isLoading}>
                  {isLoading ? "Generating..." : "Get Link"}
                </Button>
              </div>
              {isLoading && (
                <div className="mt-2 text-sm text-gray-500">
                  This may take a moment...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
