"use client";
import React, { useEffect, useState } from "react";

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import { supabaseClient } from "@/lib/supabaseClient";
// Dynamically import the ReactApexChart component
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ViewType = "weekly" | "monthly" | "yearly";

export default function TimeBasedChart() {

  const [view, setView] = useState<ViewType>("weekly");
  const [data, setData] = useState<{ label: string, count: number }[]>([]);


  useEffect(() => {
    const fetchData = async() => {
      const rpcName = 
        view === "weekly"
          ? "get_weekly_item_counts"
          : view === "monthly"
          ? "get_monthly_item_counts"
          : "get_yearly_item_counts";

      const {data, error} = await supabaseClient.rpc(rpcName)

      if (error) {
        console.error("RPC Error:", error);
        return;
      }
      setData(data);
    };

    fetchData();

  },[view]);


  const options: ApexOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: data.map((d) => d.label),
    },
    dataLabels: { enabled: false },
    plotOptions: {
      bar: { borderRadius: 4, horizontal: false },
    },
    legend: { position: "bottom" },
  };

  const series = [
    {
      name: "Items",
      data: data.map((d) => d.count),
    },
  ];
  return (
    <div className="max-w-full overflow-x-auto custom-scrollbar">
      <div id="chartOne" className="">
        <div className="mb-4 flex gap-2">
        {["weekly", "monthly", "yearly"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v as ViewType)}
            className={`px-4 py-2 rounded-lg ${
              view === v
                ? "bg-brand-600 text-white"
                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white"
            }`}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
        {data.length > 0 ? (
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
      )}
      </div>
    </div>
  );
}
