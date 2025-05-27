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
      foreColor: "#000",
      fontFamily: 'Arial, sans-serif',
      toolbar: { show: true },
      animations: { enabled: false },
      sparkline: { enabled: false },
      defaultLocale: 'en',
    },
    labels: chartData.map(item => item.label),
    colors: [
      "#1f77b4", // blue
      "#ff7f0e", // orange
      "#2ca02c", // green
      "#d62728", // red
      "#9467bd", // purple
      "#8c564b", // brown
      "#e377c2", // pink
      "#7f7f7f", // gray
      "#bcbd22", // yellow-green
      "#17becf", // cyan
      "#aec7e8", // light blue
      "#ffbb78", // light orange
      "#98df8a", // light green
      "#ff9896", // light red
      "#c5b0d5", // light purple
      "#c49c94", // light brown
      "#f7b6d2", // light pink
      "#c7c7c7", // light gray
      "#dbdb8d", // pale yellow
      "#9edae5"  // light cyan
    ],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        colors: ['#000'],
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 600,
              color: '#111',
            },
            total: {
              show: true,
              label: 'Total Items',
              fontSize: '16px',
              color: '#777',
              formatter: function(w) {
                return w.globals.seriesTotals.reduce((a:any, b:any) => a + b, 0).toString();
              },
            }
          }
        }
      }
    }
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
