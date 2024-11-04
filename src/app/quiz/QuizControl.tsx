import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ui/progressBar";
import { ChevronLeft, X } from "lucide-react";

type Props = {
  handlePressPrev: () => void;
  onExitPress: () => void;
  value: number;
};

export const QuizControl = ({ handlePressPrev, onExitPress, value }: Props) => (
  <div className="position-sticky top-0 z-10 shadow-md py-4 w-full">
    <header className="grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-between py-2 gap-2">
      <Button size="icon" variant="outline" onClick={handlePressPrev}>
        <ChevronLeft />
      </Button>
      <ProgressBar value={value} />
      <Button
        className="bg-red-600"
        size="icon"
        variant="outline"
        onClick={onExitPress}
      >
        <X />
      </Button>
    </header>
  </div>
);
