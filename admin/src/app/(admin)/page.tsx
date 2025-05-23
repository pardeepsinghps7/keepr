import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import { Dashboard } from "@/components/ecommerce/Dashboard";
import LineChart from "./(others-pages)/(chart)/line-chart/page";
import DonutChartOne from "@/components/charts/donut/DonutChartOne";
import TimeBasedChart from "@/components/charts/bar/TimeBasedChart";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import RecentItemsTable from "@/components/tables/RecentItemsTable";
import RecentUsersTable from "@/components/tables/RecentUSersTable";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
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
        <ComponentCard title="Items count by List">
          <DonutChartOne />
        </ComponentCard>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Item count by Time">
          <TimeBasedChart />
        </ComponentCard>
      </div>
      <div className="space-y-6">
        <ComponentCard title="Recent Users">
          <RecentUsersTable />
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