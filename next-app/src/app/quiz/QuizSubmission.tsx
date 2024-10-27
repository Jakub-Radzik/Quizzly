import { useEffect } from "react";
import Bar from "@/components/ui/Bar";
import Image from "next/image";
import { useReward } from "react-rewards";
import { ChevronLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    router.back();
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
        <header className="flex items-center justify-between py-2 gap-2">
          <Button size="icon" variant="outline" onClick={onHandleBack}>
            <ChevronLeft />
          </Button>
          <Button
            size="icon"
            variant="outline"
            // onClick={handleExit}
          >
            <X />
          </Button>
        </header>
      </div>
      <main className="py-11 flex flex-col gap-4 items-center flex-1 mt-24">
        <h2 className="text-3xl font-bold">Quiz is complete!</h2>
        <p>You scored: {scorePercentage}%</p>
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
              <span id="rewardId" />{" "}
              {/* Ensure the ID matches the useReward ID */}
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
      </main>
    </div>
  );
};

export default QuizSubmission;
