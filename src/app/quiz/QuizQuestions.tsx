"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/progressBar";
import { ChevronLeft, X } from "lucide-react";
import ResultCard from "./ResultCard";
import QuizSubmission from "./QuizSubmission";
import { InferSelectModel } from "drizzle-orm";
import {
  questionAnswers,
  questions as DbQuestions,
  quizzes,
} from "@/db/schema";
import { saveSubmission } from "@/actions/saveSubmissions";
import { useRouter } from "next/navigation";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quiz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quiz: Quiz;
};

// const questions = [
//   {
//     questionText: "What is React?",
//     answers: [
//       {
//         answerText: "a library for building user interfaces",
//         isCorrect: true,
//         id: 1,
//       },
//       { answerText: "a front-end framework", isCorrect: false, id: 2 },
//       { answerText: "a back-end framework", isCorrect: false, id: 3 },
//       { answerText: "a database", isCorrect: false, id: 4 },
//     ],
//   },
//   {
//     questionText: "What is JSX?",
//     answers: [
//       { answerText: "JavaScript XML", isCorrect: true, id: 1 },
//       { answerText: "JavaScript", isCorrect: false, id: 2 },
//       { answerText: "JavaScript and XML", isCorrect: false, id: 3 },
//       { answerText: "JavaScript and HTML", isCorrect: false, id: 4 },
//     ],
//   },
//   {
//     questionText: "What is the virtual DOM?",
//     answers: [
//       {
//         answerText: "A virtual representation of the DOM",
//         isCorrect: true,
//         id: 1,
//       },
//       { answerText: "A real DOM", isCorrect: false, id: 2 },
//       {
//         answerText: "A virtual representation of the browser",
//         isCorrect: false,
//         id: 3,
//       },
//       {
//         answerText: "A virtual representation of the server",
//         isCorrect: false,
//         id: 4,
//       },
//     ],
//   },
// ];

export default function QuizQuestions(props: Props) {
  const { questions } = props.quiz;
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState<
    {
      questionId: number;
      answerId: number;
    }[]
  >([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const router = useRouter();

  const handleNext = () => {
    if (!started) {
      setStarted(true);
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      setSubmitted(true); // Optionally handle the end of the quiz
      return;
    }
  };

  const handleAnswer = (answer: Answer, questionId: number) => {
    // setSelectedAnswer(answer.id);
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
    setIsCorrect(isCurrentCorrect);
  };

  const handleSubmit = async () => { 
    try {
    const subId = await saveSubmission({score}, props.quiz.id);
    } catch(e) {
      console.log(e);
    }

    setSubmitted(true);
   }

  const handlePressPrev = () => {
    if (currentQuestion! == 0) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion - 1);
    }
  };

  const handleExit = () => {
    router.push("/dashboard");
  };

  const scorePercentage: number = Math.round((score / questions.length) * 100);
  const selectedAnswer: number | null | undefined = userAnswers.find(
    (item) => item.questionId === questions[currentQuestion].id
  )?.answerId;
  const isCorrect: boolean | null = questions[
    currentQuestion
  ].answers.findIndex((answer) => answer.id === selectedAnswer)
    ? questions[currentQuestion].answers.find(
        (answer) => answer.id === selectedAnswer
      )?.isCorrect
    : null;

  if (submitted) {
    return (
      <QuizSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questions.length}
      />
    );
  }
  return (
    <div className="flex flex-col flex-1">
      <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={handlePressPrev}
          >
            <ChevronLeft />
          </Button>
          <ProgressBar value={(currentQuestion / questions.length) * 100} />
          <Button
            size="icon"
            variant="outline"
            onClick={handleExit}
          >
            <X />
          </Button>
        </header>
      </div>
      <main className="flex justify-center flex-1">
        {!started ? (
          <h1 className="text-3xl font-bold">Welcome to Quiz Time! 👋</h1>
        ) : (
          <div>
            <h2 className="text-3xl font-bold">
              {questions[currentQuestion].questionText}
            </h2>
            <div className="grid grid-cols-1 gap-6 mt-6">
              {questions[currentQuestion].answers.map((answer) => {
                const variant =
                  selectedAnswer === answer.id
                    ? answer.isCorrect
                      ? "neoSucess"
                      : "neoDanger"
                    : "neoOutline";
                selectedAnswer === answer.id
                  ? answer.isCorrect
                    ? "neoSuccess"
                    : "neoDanger"
                  : "neoOutline";
                return (
                  <Button
                    key={answer.id}
                    disabled={!!selectedAnswer !== null}
                    variant={variant}
                    size="xl"
                    onClick={() =>
                      handleAnswer(answer, questions[currentQuestion].id)
                    }
                    className="disabled:opacity-100"
                  >
                    <p className="whitespace-normal">{answer.answerText}</p>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className="footer pb-9 px-6 relative mb-0">
        <ResultCard
          isCorrect={isCorrect}
          correctAnswer={
            questions[currentQuestion].answers.find(
              (answer) => answer.isCorrect === true
            )?.answerText || ""
          }
        />
        {
          currentQuestion === questions.length -1) ? <Button variant ="neo" size="lg" onClick={handleSubmit}>Submit</Button> :
        }
        <Button
          variant="neo"
          size="lg"
          onClick={handleNext}
        >
          {!started
            ? "Start"
            // : currentQuestion === questions.length - 1
            // ? "Submit"
            : "Next"}
        </Button>
      </footer>
    </div>
  );
}
