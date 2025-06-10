"use client";

import { Button } from "@/components/ui/button";
import { Save, Share2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ToolbarProps {
  onRefresh: () => void;
  onCommit: () => void;
}

export function Toolbar({ onRefresh, onCommit }: ToolbarProps) {
  const handleSave = () => {
    toast.success("Resume saved");
  };

  return (
    <div className="flex justify-between mb-4">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Preview
        </Button>
        <Button size="sm" onClick={onCommit}>
          <Share2 className="h-4 w-4 mr-2" />
          Get Shareable Link
        </Button>
      </div>
    </div>
  );
}
