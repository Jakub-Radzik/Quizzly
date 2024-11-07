type Props = {
  name?: string | null;
  description?: string | null;
  quizLength: number;
  onStart: () => void;
};

export const StartQuiz = ({
  name,
  description,
  quizLength,
  onStart,
}: Props) => {
  return (
    <div className="max-w-lg h-[50vh] mx-auto my-10 p-6 rounded-lg shadow-md flex flex-col justify-between">
      <h1 className="text-4xl font-extrabold text-center text-indigo-400">
        Welcome to Quizzly!
      </h1>

      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-500">{name}</h2>
        <p className="mt-4 text-gray-400">{description}</p>
        <h3 className="text-xl mt-4 text-gray-200">Questions: {quizLength}</h3>
      </div>

      <div>
        <button
          onClick={onStart}
          className="mt-8 w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Start Quiz
        </button>
        <button
          onClick={() => {}}
          className="mt-2 w-full py-3 text-white text-lg font-bold rounded-lg 
          hover:bg-gray-800 border-2 hover:border-gray-200 transition duration-300"
        >
          Export Quiz
        </button>
      </div>
    </div>
  );
};
