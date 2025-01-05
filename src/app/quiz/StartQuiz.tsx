import { exportMoodle } from "@/export_moodle/export";

import { questionAnswers, quizzes, questions as DbQuestions} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm/table";

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quiz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quizData: Quiz;
  onStart: () => void;
};

export const StartQuiz = ({
  quizData,
  onStart,
}: Props) => {
  const name = quizData.name
  const description = quizData.description
  const qustionNumber = quizData.questions.length
  return (
    <div className="max-w-lg h-[50vh] mx-auto my-10 p-6 rounded-lg shadow-md flex flex-col justify-between">
      <h1 className="text-4xl font-extrabold text-center text-indigo-400">
        Welcome to Quizzly!
      </h1>

      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-500">{name}</h2>
        <p className="mt-4 text-gray-400">{description}</p>
        <h3 className="text-xl mt-4 text-gray-200">Questions: {qustionNumber}</h3>
      </div>

      <div>
        <button
          onClick={onStart}
          className="mt-8 w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Start Quiz
        </button>
        <button
          onClick={async() => {
            await exportMoodle(quizData)
          }}
          className="mt-2 w-full py-3 text-white text-lg font-bold rounded-lg 
          hover:bg-gray-800 border-2 hover:border-gray-200 transition duration-300"
        >
          Export Quiz
        </button>
      </div>
    </div>
  );
};
