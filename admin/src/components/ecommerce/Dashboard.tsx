"use client";
import React, { useEffect, useState } from "react";
import { BoxIconLine, GridIcon, GroupIcon } from "@/icons";
import { supabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

export const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<{
    user_count: number;
    pre_defined_list: number;
    custom_list: number;
  } | null>(null);

  useEffect(() => {
    const fetchDashboardData = async() => {
      setLoading(true)
      const {data,error} = await supabaseClient.rpc('get_dashboard_summary');

      if (error) {
        console.error("RPC Error:", error);
        return;
      }

      setData(data?.[0]);
      setLoading(false)
    };

    fetchDashboardData();
  },[]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <Link href={`/users`}>
      <div className="flex gap-x-2 items justify-between rounded-2xl border border-gray-200 bg-brand-200 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items justify-between">
          <div className="text-right">
            <span className="text-lg text-white dark:text-white xl:text-xl md:text-theme-xl ">
              Users
            </span>
              <h4 className="mt-2 font-bold text-white text-right text-title-md dark:text-white/90 xl:text-title-lg md:text-title-md">
                {loading ? ( '...' ) : (
                data?.user_count
                )}
              </h4>
          </div>
        </div>
      </div>
      </Link>

      <Link href={`/lists/?pre-defined=yes`}>
      <div className="flex gap-x-2 items justify-between rounded-2xl border border-gray-200 bg-brand-700 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GridIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items justify-between">
          <div className="text-right">
            <span className="text-lg text-white dark:text-white xl:text-xl md:text-theme-xl">
              Pre Defined Lists
            </span>
            <h4 className="mt-2 font-bold text-white text-right text-title-md dark:text-white/90 xl:text-title-lg md:text-title-md">
              {loading ? ( '...' ) : (
                  data?.pre_defined_list
              )}
            </h4>
          </div>
        </div>
      </div>
      </Link>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <Link href={`/lists/?pre-defined=no`}>
      <div className="flex gap-x-2 items justify-between rounded-2xl border border-gray-200 bg-brand-900 p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items justify-between">
          <div className="text-right">
            <span className="text-lg text-white dark:text-white xl:text-xl md:text-theme-xl ">
              Custom Lists
            </span>
            <h4 className="mt-2 font-bold text-white text-right text-title-md dark:text-white/90 xl:text-title-lg md:text-title-md">
              {loading ? ( '...' ) : (
                  data?.custom_list
              )}
            </h4>
          </div>
        </div>
      </div>
      </Link>
      {/* <!-- Metric Item End --> */}
    </div>
  );
};
