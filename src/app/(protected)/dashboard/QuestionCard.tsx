"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useProject } from "@/hooks/use-projects";
import Image from "next/image";
import { useState } from "react";
import { askQuestion } from "./actions";
import { readStreamableValue } from "ai/rsc";
import MDEditor from "@uiw/react-md-editor";
import { FileQuestion, X } from "lucide-react";
import CodeRef from "./code-ref";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import { useRefetch } from "@/hooks/use-refetch";

const QuestionCard = () => {
  const { project } = useProject();
  const [question, setQuestion] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filesReferences, setFileReferences] = useState<
    { fileName: string; sourceCode: string; summary: string }[]
  >([]);
  const [answer, setAnswer] = useState("");
  const saveAnswer = api.project.saveAnswer.useMutation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAnswer("");
    setFileReferences([]);
    if (!project?.id) return;
    setLoading(true);
    const { output, filesReferences } = await askQuestion(question, project.id);
    setOpen(true);
    setFileReferences(filesReferences);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((prev) => prev + delta);
      }
    }
    setLoading(false);
  };

  const refetch = useRefetch()
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[80vw]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <DialogTitle className="flex items-center gap-2">
                <Image src="/favicon.ico" alt="Logo" width={40} height={40} />
                <p>GitFlow AI</p>
              </DialogTitle>
              <Button
                disabled={saveAnswer.isPending}
                variant={"outline"}
                onClick={() => {
                  saveAnswer.mutate(
                    {
                      projectId: project!.id,
                      question,
                      answer,
                      filesReferences,
                    },
                    {
                      onSuccess: () => {
                        toast.success("Answer Saved!");
                        refetch();
                      },
                      onError: () => {
                        toast.error("Failed to Save answer!");
                      },
                    },
                  );
                }}
              >
                Save Answer
              </Button>
            </div>
          </DialogHeader>

          <MDEditor.Markdown
            source={answer}
            className="!h-full max-h-[40vh] max-w-[70vh] overflow-scroll"
          />
          <div className="h-4"></div>
          <CodeRef filesReferences={filesReferences} />
          <Button
            type="button"
            disabled={loading}
            onClick={() => {
              setOpen(false);
            }}
          >
            Close <X />
          </Button>
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Ask a Question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <input
              placeholder="Which file should I edit to change the home page?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full rounded-lg border-2 px-2 py-3"
            />
            <div className="h-4"> </div>
            <Button type="submit" disabled={loading}>
              Ask Gitflow AI! <FileQuestion />
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionCard;
