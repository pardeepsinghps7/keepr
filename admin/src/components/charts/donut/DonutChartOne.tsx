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
      "#ADD8E6", // light blue
      "#FFDAB9", // peach
      "#90EE90", // light green
      "#E6E6FA", // lavender
      "#FFB6C1", // light pink
      "#D3D3D3", // light gray
      "#E0FFFF", // light cyan
      "#F5DEB3", // wheat
      "#F08080", // light coral
      "#F0E68C", // khaki
      "#D8BFD8", // thistle
      "#B0E0E6", // powder blue
      "#FFE4E1", // misty rose
      "#EEDD82", // light goldenrod
      "#AFEEEE", // pale turquoise
      "#F5F5DC", // beige
      "#FFF0F5", // lavender blush
      "#FAFAD2", // light v yellow
      "#E6F0FA"  // very light blue
    ],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: 'Arial, sans-serif',
        colors: ['#fff'],
      },
      dropShadow: {
        enabled: false,
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
    <div className="max-w-full">
      <div id="chartEight" className="">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={420}
        />
      </div>
    </div>
  );
}
