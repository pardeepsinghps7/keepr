import type { Metadata } from "next";
import React from "react";
import { Dashboard } from "@/components/ecommerce/Dashboard";
import DonutChartOne from "@/components/charts/donut/DonutChartOne";
import TimeBasedChart from "@/components/charts/bar/TimeBasedChart";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import RecentItemsTable from "@/components/tables/RecentItemsTable";
import RecentUsersTable from "@/components/tables/RecentUsersTable";

export const metadata: Metadata = {
  title:
    "Keepr | Dashboard",
  description: "Dashboard",
};

export default function Ecommerce() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="space-y-6">
        <ComponentCard title="">
          <Dashboard />
        </ComponentCard>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        <ComponentCard title="Items Count by List">
          <DonutChartOne />
        </ComponentCard>
        <ComponentCard title="Items Count by Time">
          <TimeBasedChart />
        </ComponentCard>
        </div>
      </div>
      <div className="space-y-6">
        
      </div>
      <div className="space-y-6">
        <ComponentCard title="Recent Users">
          <RecentUsersTable/>
        </ComponentCard>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Recent Items">
          <RecentItemsTable />
        </ComponentCard>
      </div>
    </div>
  );
}