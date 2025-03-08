"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useProject } from "@/hooks/use-projects";
import { api } from "@/trpc/react";
import QuestionCard from "../dashboard/QuestionCard";
import React, { useState } from "react";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import CodeRef from "../dashboard/code-ref";

const page = () => {
  const { projectId } = useProject();
  const { data: questions } = api.project.getQuestions.useQuery({ projectId });
  const [questionIndex, setQuestionIndex] = useState(0);
  const question = questions?.[questionIndex]
  return (
    <Sheet>
      <QuestionCard />
      <div className="h-4"></div>
      <h1 className="text-xl font-semibold"> Saved Questions</h1>
      <div className="h-2"></div>
      <div className="flex flex-col gap-2">
        {questions?.map((question, index) => {
          return <React.Fragment key={question.id}>
            <SheetTrigger onClick={()=> setQuestionIndex(index)}>
              <div className="flex items-center gap-4 bg-white">
                <Image src={question.user.imageUrl ?? ""} alt="logo" className="rounded-full" height={30} width={30} />
                <div className="text-left flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-700 line-clamp-1 text-lg font-medium">{question.question}</p>
                    <span className="tex-xs text-gray-400 whitespace-nowrap"></span>
                  </div>
                  <p className="text-gray-500 line-clamp-1 text-sm">{question.answer}</p>
                </div>
              </div>
            </SheetTrigger>
          </React.Fragment>
        })}
      </div>

      {question && (
        <SheetContent className="sm:max-w-[80vw]">
          <SheetHeader>
            <SheetTitle>
              {question.question}
            </SheetTitle>
            <MDEditor.Markdown source={question.answer}/>
            <CodeRef filesReferences={(question.filesReferences ?? []) as any} />
          </SheetHeader>
        </SheetContent>
      )}
    </Sheet>
  );
};

export default page;
