"use client";

import { useState } from "react";
import QuizSubmission from "./QuizSubmission";
import { InferSelectModel } from "drizzle-orm";
import {
  questionAnswers,
  questions as DbQuestions,
  quizzes,
} from "@/db/schema";
import { saveSubmission } from "@/actions/saveSubmissions";
import { useRouter } from "next/navigation";
import { StartQuiz } from "./StartQuiz";
import ExitQuizModal from "./ExitQuizModal";
import { QuizControl } from "./QuizControl";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quiz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quiz: Quiz;
};

export default function QuizQuestions({ quiz }: Props) {
  const questionsWithAnswers = quiz.questions;
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<
    {
      questionId: number;
      answerId: number;
    }[]
  >([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const isQuestionAnswered = (questionId: number): boolean => {
    return userAnswers.some((answer) => answer.questionId === questionId);
  };

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }

    // Check if the current question already has an entry with -1 (no answer was selected)
    const alreadySkipped = userAnswers.some(
      (answer) =>
        answer.questionId === questionsWithAnswers[currentQuestion].id &&
        answer.answerId === -1
    );

    // Check if no answer is selected
    if (selectedAnswer === null) {
      // If the question was previously skipped (answerId === -1), no delay is applied
      if (alreadySkipped) {
        setUserAnswers([
          ...userAnswers,
          {
            questionId: questionsWithAnswers[currentQuestion].id,
            answerId: -1, // Indicating no answer was selected
          },
        ]);

        // Move to the next question without delay
        if (currentQuestion < questionsWithAnswers.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null); // Reset the selected answer for the next question
        } else {
          setSubmitted(true); // Optionally handle the end of the quiz
        }
      } else {
        // If the question was not previously skipped, save no-answer (-1) and delay navigation
        setUserAnswers([
          ...userAnswers,
          {
            questionId: questionsWithAnswers[currentQuestion].id,
            answerId: -1, // Indicating no answer was selected
          },
        ]);

        // Delay moving to the next question
        setTimeout(() => {
          if (currentQuestion < questionsWithAnswers.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null); // Reset the selected answer for the next question
          } else {
            setSubmitted(true); // Optionally handle the end of the quiz
          }
        }, 500); // 1000 ms delay (adjust as needed)
      }
    } else {
      // Save the selected answer and move to the next question immediately
      setUserAnswers([
        ...userAnswers,
        {
          questionId: questionsWithAnswers[currentQuestion].id,
          answerId: selectedAnswer,
        },
      ]);

      // Move to the next question without delay
      if (currentQuestion < questionsWithAnswers.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null); // Reset the selected answer for the next question
      } else {
        setSubmitted(true); // Optionally handle the end of the quiz
      }
    }
  };

  const handleAnswer = (answer: Answer, questionId: number) => {
    if (isQuestionAnswered(questionId)) {
      return;
    }

    setSelectedAnswer(answer.id);
    const newUserAnswerArr = [
      ...userAnswers,
      {
        answerId: answer.id,
        questionId,
      },
    ];
    setUserAnswers(newUserAnswerArr);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      await saveSubmission({ score }, quiz.id);
    } catch (e) {
      console.log(e);
    }

    setSubmitted(true);
  };

  const handlePressPrev = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion - 1);
    }
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  const scorePercentage: number = Math.round(
    (score / questionsWithAnswers.length) * 100
  );

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleExitQuiz = () => {
    handleExit();
    // ! MAYBE SAVE AS IT IS !
    setIsModalOpen(false);
  };

  const onExitPress = () => {
    setIsModalOpen(true);
  };

  if (submitted) {
    return (
      <QuizSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questionsWithAnswers.length}
      />
    );
  }
  return (
    <div className="flex flex-col">
      <ExitQuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleExitQuiz}
      />
      <main className="flex justify-center flex-1">
        {!started ? (
          <StartQuiz
            name={quiz.name}
            description={quiz.description}
            quizLength={quiz.questions.length}
            onStart={handleNext}
          />
        ) : (
          <div className="max-w-3xl w-full mx-auto p-4">
            <QuizControl
              handlePressPrev={handlePressPrev}
              onExitPress={onExitPress}
              value={(currentQuestion / questionsWithAnswers.length) * 100}
            />

            <h2 className="text-3xl font-bold">
              {questionsWithAnswers[currentQuestion].questionText}
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-20">
              {questionsWithAnswers[currentQuestion].answers.map((answer) => {
                const baseButtonStyle =
                  "px-4 py-2 rounded-lg text-white font-semibold focus:outline-none transition";

                const disabled = isQuestionAnswered(
                  questionsWithAnswers[currentQuestion].id
                );

                const isCorrectAnswer = answer.isCorrect;

                const selectedStyle =
                  selectedAnswer === answer.id
                    ? answer.isCorrect
                      ? `border-2 border-green-500 bg-green-500 ${
                          !disabled && "hover:bg-green-600"
                        }` // neoSuccess
                      : `border-2 border-red-500 bg-red-500 ${
                          !disabled && "hover:bg-red-600"
                        }` // neoDanger
                    : `border-2 border-gray-400 bg-background ${
                        !disabled && "hover:bg-gray-800"
                      }`; // neoOutline

                const correctAnswerStyle =
                  disabled && isCorrectAnswer
                    ? "border-2 border-green-500 bg-green-500"
                    : "";

                const disabledStyles = disabled
                  ? "bg-gray-500 cursor-not-allowed"
                  : "";

                return (
                  <button
                    disabled={disabled}
                    key={answer.id}
                    className={`${baseButtonStyle} ${selectedStyle} ${correctAnswerStyle} ${disabledStyles} py-4`}
                    onClick={() =>
                      handleAnswer(
                        answer,
                        questionsWithAnswers[currentQuestion].id
                      )
                    }
                  >
                    <p className="whitespace-normal">{answer.answerText}</p>
                  </button>
                );
              })}

              <button
                onClick={
                  currentQuestion === questionsWithAnswers.length - 1
                    ? handleSubmit
                    : handleNext
                }
                className="mt-8 w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                {currentQuestion === 0 && !started
                  ? "Start"
                  : currentQuestion === questionsWithAnswers.length - 1
                  ? "Submit"
                  : "Next"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
