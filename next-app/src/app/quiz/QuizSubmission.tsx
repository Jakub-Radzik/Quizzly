import { useEffect } from "react";
import Bar from "@/components/ui/Bar";
import Image from "next/image";
import { useReward } from "react-rewards";
import { useRouter } from "next/navigation";

type Props = {
  scorePercentage: number;
  score: number;
  totalQuestions: number;
};

const QuizSubmission = (props: Props) => {
  const { scorePercentage, score, totalQuestions } = props;
  const { reward } = useReward("rewardId", "confetti"); // Ensure the span ID matches

  const router = useRouter(); // Correct usage of useRouter

  useEffect(() => {
    if (scorePercentage === 100) {
      reward();
    }
  }, [scorePercentage, reward]);

  const onHandleBack = () => {
    router.push("/quiz/new");
  };

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col gap-4 items-center flex-1 mt-24">
        <h1 className="text-4xl font-bold">Quiz is complete!</h1>
        <h1 className="text-2xl font-bold">You scored: {scorePercentage}%</h1>
        {scorePercentage === 100 ? (
          <div className="flex flex-col items-center">
            <p>Congratulations!</p>
            <div className="flex justify-center">
              <div>
                <Image
                  src="/images/owl-smiling.png"
                  alt="smiling owl image"
                  width={300}
                  height={300}
                />
              </div>
              <span id="rewardId" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-row gap-8 mt-6">
              <Bar percentage={scorePercentage} color="green" />
              <Bar percentage={100 - scorePercentage} color="red" />
            </div>
            <div className="flex flex-row gap-8">
              <p>{score} correct</p>
              <p>{totalQuestions - score} incorrect</p>
            </div>
          </>
        )}
        <div>
          <button
            onClick={onHandleBack}
            className="px-10 mt-8 w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Restart
          </button>
        </div>
      </main>
    </div>
  );
};

export default QuizSubmission;
