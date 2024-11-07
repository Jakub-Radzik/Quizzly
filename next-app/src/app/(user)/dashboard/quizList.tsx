"use client";

import Link from "next/link";
import React from "react";

interface Submission {
  id: number;
  userName: string;
  score: number | null;
  attemptNumber: number;
  createdAt: Date;
}

interface QuizData {
  quiz: {
    id: number;
    name: string;
    description: string;
    questionCount: number;
  };
  submissions: Submission[];
}

interface QuizListProps {
  quizzes: QuizData[];
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  return (
    <div className=" pt-5 font-sans">
      <h1 className="text-2xl font-bold mb-5">Quizzes and Submissions</h1>
      <div className="flex flex-col gap-5">
        {quizzes.map((quizData) => (
          <div
            key={quizData.quiz.id}
            className="border border-gray-700 rounded-lg p-4 shadow-md"
          >
            <div className="flex justify-between items-start shadow-md rounded-lg p-1 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-100">
                  {quizData.quiz.name}
                </h2>
                <p
                  className="text-gray-500 mt-2 mb-2"
                  style={{ maxWidth: 500 }}
                >
                  {quizData.quiz.description}
                </p>
                <p className="text-sm text-gray-500">
                  Questions: {quizData.quiz.questionCount}
                </p>
              </div>
              <div className="mt-5">
                <Link
                  href={`/quiz/${quizData.quiz.id}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-200"
                >
                  Redo Quiz
                </Link>
              </div>
            </div>

            <h3 className="mt-4 font-semibold">Submissions:</h3>
            <ul className="mt-2">
              {quizData.submissions.length > 0 ? (
                quizData.submissions.map((submission) => (
                  <li key={submission.id} className="mb-2 rounded">
                    {`${new Date(
                      submission.createdAt
                    ).toLocaleString()} - Score ${submission.score} / ${
                      quizData.quiz.questionCount
                    }`}
                  </li>
                ))
              ) : (
                <li>No submissions yet.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
