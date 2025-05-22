"use client";
import React, { useEffect, useState } from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { supabaseClient } from "@/lib/supabaseClient";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function DonutChartOne() {

  const [chartData, setChartData] = useState<
    {
      label: string,
      item_count: number
    }[]
  >([])

  useEffect(() => {
    const fetchData = async() => {
      const {data,error} = await supabaseClient.rpc('get_item_counts_by_lists');

      if(error){
        console.error("RPC Error:", error);
        return;
      }

      setChartData(data);

    }
    fetchData();
  },[]);
  
  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: chartData.map(item => item.label),
    legend: {
      position: "bottom",
    },
  };

  const series = chartData.map(item => item.item_count);

  if (series.length === 0) {
    return <div className="text-gray-500 dark:text-gray-400">No data available</div>;
  }

  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartEight" className="">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={320}
        />
      </div>
    </div>
  );
}
