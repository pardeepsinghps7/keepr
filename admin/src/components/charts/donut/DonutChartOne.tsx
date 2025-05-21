"use client";
import React from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function DonutChartOne() {
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Movies", "Beer", "Wine"],
    legend: {
      position: "bottom",
    },
  };

  const series = [10,12,13];
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={300}
        />
      </div>
    </div>
  );
}
