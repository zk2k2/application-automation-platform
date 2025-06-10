"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditorPane } from "@/components/editor/EditorPane";
import { PreviewPane } from "@/components/editor/PreviewPane";
import { Toolbar } from "@/components/editor/Toolbar";
import { CommitModal } from "@/components/editor/CommitModal";
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
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);

  const handleContentChange = (content: string) => {
    setLatexContent(content);
  };

  const handleManualRefresh = () => {
    setTriggerPreview(Date.now());
  };

  const handleOpenCommitModal = () => {
    setIsCommitModalOpen(true);
  };

  const handleCloseCommitModal = () => {
    setIsCommitModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Resume Editor</CardTitle>
        </CardHeader>
        <CardContent>
          <Toolbar
            onRefresh={handleManualRefresh}
            onCommit={handleOpenCommitModal}
          />
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
              <PreviewPane latexContent={latexContent} key={triggerPreview} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </CardContent>
      </Card>
      <CommitModal
        isOpen={isCommitModalOpen}
        onClose={handleCloseCommitModal}
        latexContent={latexContent}
      />
    </div>
  );
};
export default EditorPage;
