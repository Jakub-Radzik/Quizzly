"use client";

import Link from "next/link";
import React from "react";

interface Submission {
  id: string;
  userName: string;
  score: number | null;
  attemptNumber: number;
  createdAt: Date;
}

interface QuizData {
  quiz: {
    id: string;
    name: string;
    description: string;
    questionCount: number;
    createdAt: Date;
  };
  submissions: Submission[];
}

interface QuizListProps {
  quizzes: QuizData[];
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  if (!quizzes || quizzes.length === 0) {
    return <p className="text-gray-400 text-center">No quizzes available.</p>;
  }

  return (
    <div className="pt-5 font-sans px-4 sm:px-8 lg:px-16">
      <h1 className="text-2xl font-bold mb-5 text-gray-100">
        Quizzes and Submissions
      </h1>
      <div className="flex flex-col gap-6">
        {quizzes.map((quizData) => (
          <div
            key={quizData.quiz.id}
            className="border border-gray-700 bg-gray-800 rounded-lg p-4 shadow-md transition-transform transform hover:scale-105"
          >
            <div className="flex justify-between items-start shadow-sm rounded-lg p-1 mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-100">
                  {quizData.quiz.name}
                </h2>
                <p className="text-sm text-gray-400">
                  Created: {new Date(quizData.quiz.createdAt).toLocaleString()}
                </p>
                <p
                  className="text-gray-500 mt-2 mb-2"
                  style={{ maxWidth: "500px" }}
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
                  aria-label={`Redo quiz ${quizData.quiz.name}`}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition duration-200"
                >
                  Redo Quiz
                </Link>
              </div>
            </div>

            <h3 className="mt-4 font-semibold text-gray-200">Submissions:</h3>
            <ul className="mt-2">
              {quizData.submissions.length > 0 ? (
                quizData.submissions.map((submission) => (
                  <li
                    key={submission.id}
                    className="mb-2 p-2 bg-gray-700 rounded text-gray-300"
                  >
                    <span className="font-semibold">
                      {new Date(submission.createdAt).toLocaleString()}
                    </span>{" "}
                    - Score: {submission.score ?? "N/A"} /{" "}
                    {quizData.quiz.questionCount}
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No submissions yet.</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
