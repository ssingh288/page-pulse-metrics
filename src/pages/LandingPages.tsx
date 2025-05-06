
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { PageTable, PageData } from "@/components/dashboard/PageTable";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data with more pages
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
  {
    id: "5",
    name: "Free Trial Signup",
    status: "active",
    conversionRate: 0.068,
    visitors: 5800,
    createdAt: new Date("2023-05-12"),
  },
  {
    id: "6",
    name: "Enterprise Solution",
    status: "active",
    conversionRate: 0.032,
    visitors: 2100,
    createdAt: new Date("2023-04-01"),
  },
  {
    id: "7",
    name: "Email Newsletter",
    status: "archived",
    conversionRate: 0.085,
    visitors: 12000,
    createdAt: new Date("2023-01-20"),
  },
];

const LandingPages = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filteredPages, setFilteredPages] = useState<PageData[]>([]);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPages(mockPageData);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = mockPageData.filter((page) =>
        page.name.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredPages(filtered);
    }
  }, [searchTerm]);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Landing Pages</h2>
            <p className="text-muted-foreground mt-2">
              Manage and track your marketing pages
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add New Page
          </Button>
        </div>

        <div className="flex items-center border rounded-md px-3 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            placeholder="Search pages..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <PageTable pages={filteredPages} loading={loading} />
      </div>
    </Layout>
  );
};

export default LandingPages;
