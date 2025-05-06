
import Layout from "@/components/layout/Layout";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { MetricsChart } from "@/components/dashboard/MetricsChart";
import { PageTable, PageData } from "@/components/dashboard/PageTable";
import { Users, PieChart, Clock, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

// Mock data
const mockVisitorData = [
  { name: "Jan", visitors: 1000 },
  { name: "Feb", visitors: 1200 },
  { name: "Mar", visitors: 900 },
  { name: "Apr", visitors: 1500 },
  { name: "May", visitors: 2000 },
  { name: "Jun", visitors: 1800 },
  { name: "Jul", visitors: 2200 },
];

const mockConversionData = [
  { name: "Jan", rate: 2.1 },
  { name: "Feb", rate: 2.3 },
  { name: "Mar", rate: 2.5 },
  { name: "Apr", rate: 3.1 },
  { name: "May", rate: 3.8 },
  { name: "Jun", rate: 3.2 },
  { name: "Jul", rate: 3.5 },
];

const mockPageData: PageData[] = [
  {
    id: "1",
    name: "Homepage Redesign",
    status: "active",
    conversionRate: 0.038,
    visitors: 12500,
    createdAt: new Date("2023-03-15"),
  },
  {
    id: "2",
    name: "Product Landing Page",
    status: "active",
    conversionRate: 0.052,
    visitors: 8750,
    createdAt: new Date("2023-04-22"),
  },
  {
    id: "3",
    name: "Black Friday Special",
    status: "draft",
    conversionRate: 0.0,
    visitors: 0,
    createdAt: new Date("2023-06-05"),
  },
  {
    id: "4",
    name: "Webinar Registration",
    status: "archived",
    conversionRate: 0.125,
    visitors: 3200,
    createdAt: new Date("2023-02-10"),
  },
];

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-2">
            Your marketing performance at a glance
          </p>
        </div>

        <div className="stats-grid">
          <MetricsCard
            title="Total Visitors"
            value={loading ? "" : "24,450"}
            icon={<Users size={18} />}
            trend={12.5}
            loading={loading}
          />
          <MetricsCard
            title="Conversion Rate"
            value={loading ? "" : "3.8%"}
            icon={<PieChart size={18} />}
            trend={0.7}
            loading={loading}
          />
          <MetricsCard
            title="Avg. Time on Page"
            value={loading ? "" : "2m 45s"}
            icon={<Clock size={18} />}
            trend={-5.1}
            loading={loading}
          />
          <MetricsCard
            title="Bounce Rate"
            value={loading ? "" : "42.3%"}
            icon={<BarChart3 size={18} />}
            trend={-3.2}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MetricsChart
            title="Visitors (Last 7 Months)"
            data={mockVisitorData}
            dataKey="visitors"
            loading={loading}
          />
          <MetricsChart
            title="Conversion Rate % (Last 7 Months)"
            data={mockConversionData}
            dataKey="rate"
            type="bar"
            loading={loading}
          />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Landing Pages</h3>
          <PageTable pages={mockPageData} loading={loading} />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
