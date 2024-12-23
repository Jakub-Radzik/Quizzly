import { auth } from "@/auth";
import getUserMetrics from "@/app/actions/getUserMetrics";
import getHeatMapData from "@/app/actions/getHeatMapData";
import MetricCard from "./metricCard";
import SubmissionsHeatMap from "./heatMap";
import QuizListServer from "./quizListServer";
import ProfileCard from "./profile";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found</p>;
  }

  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();

  return (
    <>
      <div className="mt-4" />
      <ProfileCard />
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {userData && userData.length > 0
            ? userData.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                />
              ))
            : null}
        </div>
      </div>

      <div className="flex justify-center items-center p-4 sm:p-6 lg:p-8">
        {heatMapData ? (
          <div className="w-full max-w-2xl">
            <SubmissionsHeatMap data={heatMapData.data} />
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base text-center">
            Loading heatmap data...
          </p>
        )}
      </div>
      <QuizListServer />
    </>
  );
};

export default page;
