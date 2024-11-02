"use client";

import React from "react";
import Tooltip from "@uiw/react-tooltip";
import HeatMap from "@uiw/react-heat-map";
import { convertDateToString } from "@/lib/utils";

type Props = {
  data: {
    createdAt: Date;
    count: number;
  }[];
};

const panelColors = {
  0: "#2f3238",
  1: "#3f473f",
  2: "#4f5b49", // Faded green-gray
  3: "#6b7d4f", // Dark olive green
  4: "#8fa863", // Muted green
  5: "#A1C564", // Pale green
  6: "#B4D875", // Light green
  7: "#C8E48A", // Light yellow-green
  8: "#DCEE9C", // Soft yellow
  9: "#F1F4B1", // Light pale yellow
  10: "#F6F69B", // Bright yellow-green for the highest values
};

const SubmissionsHeatMap = (props: Props) => {
  const currentYear = new Date().getFullYear();

  const formattedDates = props.data.map((item) => ({
    date: convertDateToString(item.createdAt),
    count: item.count,
  }));

  return (
    <HeatMap
      value={formattedDates}
      width={700}
      rectSize={12}
      style={{ color: "#888" }}
      startDate={new Date(`${currentYear}/01/01`)}
      endDate={new Date(`${currentYear}/12/31`)}
      panelColors={panelColors}
      rectRender={(heatmapProps, data) => {
        const tooltipContent = `${data.count || 0}`;

        return (
          <Tooltip placement="top" content={tooltipContent}>
            <rect {...heatmapProps} />
          </Tooltip>
        );
      }}
    />
  );
};

export default SubmissionsHeatMap;
