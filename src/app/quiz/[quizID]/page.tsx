import React from "react";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq } from "drizzle-orm";
import QuizQuestions from "../QuizQuestions";

const page = async ({
  params,
}: {
  params: {
    quizID: string;
  };
}) => {
  const quizId = params.quizID;

  if (!quizId) {
    return <div>Quiz ID is missing.</div>;
  }

  const quiz = await db.query.quizzes.findFirst({
    where: eq(quizzes.id, parseInt(quizId)),
    with: {
      questions: {
        with: {
          answers: true,
        },
      },
    },
  });

  if (!quizId || !quiz || quiz.questions.length === 0) {
    return <div>Quiz not found.</div>;
  }

  return <QuizQuestions quiz={quiz} />;
};

export default page;
