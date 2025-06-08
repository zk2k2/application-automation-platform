"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorPane } from "@/components/editor/EditorPane";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { Toolbar } from "@/components/editor/Toolbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useState } from "react";
import { FC } from "react";

const EditorPage: FC = () => {
  const [latexContent, setLatexContent] = useState<string>("");
  const [triggerPreview, setTriggerPreview] = useState<number>(Date.now());

  const handleContentChange = (content: string) => {
    setLatexContent(content);
  };

  const handleManualRefresh = () => {
    // Update the trigger to force a preview refresh
    setTriggerPreview(Date.now());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Resume Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Toolbar onRefresh={handleManualRefresh} />
          <ResizablePanelGroup
            direction="horizontal"
            className="min-h-[600px] rounded-lg border"
          >
            <ResizablePanel defaultSize={50} minSize={30}>
              <EditorPane
                initialContent={latexContent}
                onContentChange={handleContentChange}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} minSize={30}>
              <PreviewPane
                latexContent={latexContent}
                key={triggerPreview} // This forces re-render when trigger changes
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
    </div>
  );
};
export default EditorPage;
