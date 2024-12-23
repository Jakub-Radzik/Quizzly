import { roundIfNumber } from "@lib/utils";

type Props = {
  value: number | string | null;
  label: string;
};

const MetricCard = (props: Props) => {
  const { value, label } = props;

  return (
    <div className="p-6 border rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
      <p className="text-[#6c7381] text-sm md:text-base">{label}</p>
      <p className="text-2xl md:text-3xl font-bold mt-2">
        {roundIfNumber(value)}
      </p>
    </div>
  );
};

export default MetricCard;
