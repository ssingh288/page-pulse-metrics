
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronRight, PieChart, BarChart3, Beaker, AlertCircle } from "lucide-react";

// Mock AB Test data
const mockTests = [
  { 
    id: "1", 
    name: "Homepage Hero Section", 
    status: "active", 
    createdAt: "2025-04-28",
    endDate: "2025-05-15",
    variants: [
      { name: "A", description: "Current version", visitors: 1245, conversions: 87, conversionRate: 6.99 },
      { name: "B", description: "New headline", visitors: 1253, conversions: 112, conversionRate: 8.94 }
    ]
  },
  { 
    id: "2", 
    name: "Pricing Page Layout", 
    status: "active", 
    createdAt: "2025-05-01",
    endDate: "2025-05-22",
    variants: [
      { name: "A", description: "Current design", visitors: 823, conversions: 53, conversionRate: 6.44 },
      { name: "B", description: "New layout", visitors: 831, conversions: 67, conversionRate: 8.06 }
    ]
  },
  { 
    id: "3", 
    name: "CTA Button Color", 
    status: "completed", 
    createdAt: "2025-03-15",
    endDate: "2025-04-15",
    variants: [
      { name: "A", description: "Blue button", visitors: 2543, conversions: 178, conversionRate: 7.00 },
      { name: "B", description: "Green button", visitors: 2538, conversions: 234, conversionRate: 9.22 }
    ]
  },
  { 
    id: "4", 
    name: "Mobile Form Layout", 
    status: "draft", 
    createdAt: "2025-05-05",
    endDate: null,
    variants: [
      { name: "A", description: "Current form", visitors: 0, conversions: 0, conversionRate: 0 },
      { name: "B", description: "Simplified form", visitors: 0, conversions: 0, conversionRate: 0 }
    ]
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  };
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[status as keyof typeof variants]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const ABTests = () => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const test = selectedTest ? mockTests.find(t => t.id === selectedTest) : null;
  
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">A/B Testing</h2>
          <p className="text-muted-foreground mt-2">
            Create and manage A/B tests for your landing pages
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Test Campaigns</CardTitle>
                <CardDescription>Manage your active and past tests</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="px-4 py-3 border-b last:border-0">
                        <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
                      </div>
                    ))
                  ) : (
                    mockTests.map((test) => (
                      <button
                        key={test.id}
                        onClick={() => setSelectedTest(test.id)}
                        className={`flex items-center justify-between px-4 py-3 border-b last:border-0 text-left hover:bg-muted/50 transition-colors ${selectedTest === test.id ? 'bg-muted/50' : ''}`}
                      >
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="flex items-center mt-1">
                            <StatusBadge status={test.status} />
                            <span className="text-xs text-muted-foreground ml-2">
                              {test.createdAt}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))
                  )}
                </nav>
              </CardContent>
              <CardFooter className="pt-4 pb-4">
                <Button className="w-full">
                  <Beaker className="mr-2 h-4 w-4" />
                  Create New Test
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <>
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Active Tests</div>
                      <div className="font-medium">2</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Completed Tests</div>
                      <div className="font-medium">1</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">Avg. Improvement</div>
                      <div className="font-medium text-green-600">+2.43%</div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            {loading ? (
              <Card>
                <CardHeader>
                  <div className="h-7 w-2/3 bg-muted rounded animate-pulse mb-2" />
                  <div className="h-5 w-full bg-muted rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ) : selectedTest ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{test?.name}</CardTitle>
                        <CardDescription>
                          Created on {test?.createdAt} • {test?.status === "active" ? `Ends on ${test?.endDate}` : test?.status === "completed" ? `Ended on ${test?.endDate}` : "Not started yet"}
                        </CardDescription>
                      </div>
                      <StatusBadge status={test?.status || "draft"} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="results">
                      <TabsList>
                        <TabsTrigger value="results">Results</TabsTrigger>
                        <TabsTrigger value="variants">Variants</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="results" className="space-y-4 pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 px-4 pb-4">
                              <div className="text-2xl font-bold">
                                {test?.variants.reduce((sum, variant) => sum + variant.visitors, 0)}
                              </div>
                              <p className="text-xs text-muted-foreground">Across all variants</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 px-4 pb-4">
                              <div className="text-2xl font-bold">
                                {test?.variants.reduce((sum, variant) => sum + variant.conversions, 0)}
                              </div>
                              <p className="text-xs text-muted-foreground">Across all variants</p>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-sm font-medium">Avg. Conversion Rate</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 px-4 pb-4">
                              <div className="text-2xl font-bold">
                                {((test?.variants.reduce((sum, variant) => sum + variant.conversions, 0) || 0) / 
                                  (test?.variants.reduce((sum, variant) => sum + variant.visitors, 0) || 1) * 100).toFixed(2)}%
                              </div>
                              <p className="text-xs text-muted-foreground">Across all variants</p>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Variant Performance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Variant</TableHead>
                                  <TableHead>Description</TableHead>
                                  <TableHead>Visitors</TableHead>
                                  <TableHead>Conversions</TableHead>
                                  <TableHead>Rate</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {test?.variants.map((variant) => {
                                  const isWinner = 
                                    variant.conversionRate === Math.max(...(test?.variants.map(v => v.conversionRate) || [0])) &&
                                    test.status === 'completed';
                                    
                                  return (
                                    <TableRow key={variant.name}>
                                      <TableCell className="font-medium">
                                        {variant.name} {isWinner && <span className="text-green-600 ml-1">👑</span>}
                                      </TableCell>
                                      <TableCell>{variant.description}</TableCell>
                                      <TableCell>{variant.visitors.toLocaleString()}</TableCell>
                                      <TableCell>{variant.conversions.toLocaleString()}</TableCell>
                                      <TableCell className={isWinner ? "text-green-600 font-medium" : ""}>
                                        {variant.conversionRate.toFixed(2)}%
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                        
                        {test?.status === 'completed' && (
                          <Card className="border-green-600/40 bg-green-50 dark:bg-green-900/10">
                            <CardHeader>
                              <CardTitle className="flex items-center text-green-600">
                                <Beaker className="mr-2 h-5 w-5" />
                                Test Results
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>
                                Variant <span className="font-medium">B</span> performed better with a 
                                <span className="font-medium text-green-600"> 2.22% higher conversion rate</span>. 
                                We recommend implementing variant B permanently.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                        
                        {test?.status === 'active' && (
                          <Card className="border-yellow-600/40 bg-yellow-50 dark:bg-yellow-900/10">
                            <CardHeader>
                              <CardTitle className="flex items-center text-yellow-600">
                                <AlertCircle className="mr-2 h-5 w-5" />
                                Test In Progress
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>
                                This test is still running. Initial results show that variant B is performing 
                                slightly better, but more data is needed for statistical significance.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="variants" className="space-y-4 pt-4">
                        {test?.variants.map((variant) => (
                          <Card key={variant.name}>
                            <CardHeader>
                              <CardTitle>Variant {variant.name}</CardTitle>
                              <CardDescription>{variant.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Content Changes</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Headline:</span>
                                      <span className="font-medium">{variant.name === "A" ? "Increase Conversions Today" : "Boost Your Sales by 30%"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">CTA Button:</span>
                                      <span className="font-medium">{variant.name === "A" ? "Get Started" : "Start Free Trial"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Hero Image:</span>
                                      <span className="font-medium">{variant.name === "A" ? "dashboard.jpg" : "analytics.jpg"}</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Performance</h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Visitors:</span>
                                      <span className="font-medium">{variant.visitors}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Conversions:</span>
                                      <span className="font-medium">{variant.conversions}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Conversion Rate:</span>
                                      <span className="font-medium">{variant.conversionRate.toFixed(2)}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button variant="outline" size="sm">Preview Variant</Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </TabsContent>
                      
                      <TabsContent value="settings" className="space-y-4 pt-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>Test Configuration</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 gap-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Test Name</label>
                                  <Input defaultValue={test?.name} disabled={test?.status !== 'draft'} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium mb-1 block">Start Date</label>
                                    <Input defaultValue={test?.createdAt} disabled={test?.status !== 'draft'} />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-1 block">End Date</label>
                                    <Input defaultValue={test?.endDate || ''} disabled={test?.status !== 'draft'} />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Target Page</label>
                                  <Select disabled={test?.status !== 'draft'}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select page" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="homepage">Homepage</SelectItem>
                                      <SelectItem value="pricing">Pricing Page</SelectItem>
                                      <SelectItem value="product">Product Page</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Success Metric</label>
                                  <Select disabled={test?.status !== 'draft'}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select metric" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cta_clicks">CTA Button Clicks</SelectItem>
                                      <SelectItem value="form_completions">Form Completions</SelectItem>
                                      <SelectItem value="purchases">Purchases</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between">
                            {test?.status === 'draft' ? (
                              <>
                                <Button variant="outline">Cancel</Button>
                                <Button>Save & Launch Test</Button>
                              </>
                            ) : test?.status === 'active' ? (
                              <Button variant="destructive">End Test Early</Button>
                            ) : (
                              <Button>Duplicate Test</Button>
                            )}
                          </CardFooter>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] border border-dashed rounded-lg p-8">
                <div className="text-center">
                  <Beaker className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Select an A/B test</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    Choose a test from the list to view its performance and details
                  </p>
                  <Button>Create a new test</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ABTests;
