
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, PieChart, LineChart, 
  Bar, Pie, Line, XAxis, YAxis, 
  Legend, Cell, Tooltip as RechartsTooltip
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Globe, Users, Monitor, Smartphone, Clock, Calendar } from "lucide-react";

// Mock audience data
const mockCountryData = [
  { name: "United States", value: 45, users: 3750 },
  { name: "United Kingdom", value: 15, users: 1250 },
  { name: "Germany", value: 12, users: 1000 },
  { name: "Canada", value: 8, users: 665 },
  { name: "France", value: 6, users: 500 },
  { name: "Other", value: 14, users: 1170 },
];

const mockDeviceData = [
  { name: "Desktop", value: 62, users: 5170 },
  { name: "Mobile", value: 33, users: 2750 },
  { name: "Tablet", value: 5, users: 415 },
];

const mockBrowserData = [
  { name: "Chrome", value: 54, users: 4500 },
  { name: "Safari", value: 28, users: 2335 },
  { name: "Firefox", value: 8, users: 670 },
  { name: "Edge", value: 7, users: 585 },
  { name: "Opera", value: 2, users: 165 },
  { name: "Other", value: 1, users: 85 },
];

const mockTimeData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  visits: Math.floor(Math.random() * 100) + (i >= 8 && i <= 20 ? 100 : 20),
}));

const mockSessionData = [
  { name: "0-10s", value: 15, users: 1250 },
  { name: "10-30s", value: 20, users: 1670 },
  { name: "30s-1m", value: 25, users: 2085 },
  { name: "1-3m", value: 22, users: 1835 },
  { name: "3-5m", value: 10, users: 835 },
  { name: "5m+", value: 8, users: 670 },
];

const colorMap = {
  Desktop: "#4ade80",
  Mobile: "#3b82f6",
  Tablet: "#a855f7",
  Chrome: "#3b82f6",
  Safari: "#f97316",
  Firefox: "#ef4444",
  Edge: "#06b6d4",
  Opera: "#f43f5e",
  Other: "#94a3b8",
};

const Audience = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last7days");
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const chartConfig = Object.keys(colorMap).reduce((acc, key) => {
    acc[key] = { color: colorMap[key as keyof typeof colorMap] };
    return acc;
  }, {} as Record<string, { color: string }>);

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Audience Insights</h2>
            <p className="text-muted-foreground mt-2">
              Understand your audience demographics and behavior
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last7days">Last 7 days</SelectItem>
                <SelectItem value="last30days">Last 30 days</SelectItem>
                <SelectItem value="thismonth">This month</SelectItem>
                <SelectItem value="lastmonth">Last month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="stats-grid">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Users className="h-4 w-4 text-muted-foreground mr-2" />
                <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 bg-muted rounded-md animate-pulse" />
              ) : (
                <div className="text-2xl font-bold">8,335</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-muted-foreground mr-2" />
                <CardTitle className="text-sm font-medium">Top Country</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 bg-muted rounded-md animate-pulse" />
              ) : (
                <div className="text-2xl font-bold">United States</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Monitor className="h-4 w-4 text-muted-foreground mr-2" />
                <CardTitle className="text-sm font-medium">Device Type</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 bg-muted rounded-md animate-pulse" />
              ) : (
                <div className="text-2xl font-bold">62% Desktop</div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-9 bg-muted rounded-md animate-pulse" />
              ) : (
                <div className="text-2xl font-bold">1m 47s</div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="geography">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto">
            <TabsTrigger value="geography">Geography</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="demographics" className="hidden md:flex">Demographics</TabsTrigger>
            <TabsTrigger value="sources" className="hidden md:flex">Sources</TabsTrigger>
            <TabsTrigger value="engagement" className="hidden md:flex">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="geography" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Visitors by Country</CardTitle>
                  <CardDescription>Distribution of visitors across countries</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  {loading ? (
                    <div className="h-full bg-muted rounded-md animate-pulse" />
                  ) : (
                    <ChartContainer className="h-full" config={chartConfig}>
                      <PieChart>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Country</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].name}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Visitors</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].payload.users?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Percentage</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].value}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Pie
                          data={mockCountryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        />
                      </PieChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries</CardTitle>
                  <CardDescription>Visitors by country</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-8 bg-muted rounded-md animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Country</TableHead>
                          <TableHead className="text-right">Visitors</TableHead>
                          <TableHead className="text-right">%</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCountryData.map((country) => (
                          <TableRow key={country.name}>
                            <TableCell>{country.name}</TableCell>
                            <TableCell className="text-right">{country.users.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{country.value}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Geographic Insights</CardTitle>
                <CardDescription>Key metrics by region</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[200px] bg-muted rounded-md animate-pulse" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Region</TableHead>
                        <TableHead>Visitors</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Bounce Rate</TableHead>
                        <TableHead>Conversion Rate</TableHead>
                        <TableHead>Avg. Session Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>North America</TableCell>
                        <TableCell>4,415</TableCell>
                        <TableCell>6,380</TableCell>
                        <TableCell>38.4%</TableCell>
                        <TableCell>5.2%</TableCell>
                        <TableCell>1m 53s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Europe</TableCell>
                        <TableCell>2,750</TableCell>
                        <TableCell>4,120</TableCell>
                        <TableCell>42.1%</TableCell>
                        <TableCell>4.7%</TableCell>
                        <TableCell>1m 41s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Asia</TableCell>
                        <TableCell>875</TableCell>
                        <TableCell>1,230</TableCell>
                        <TableCell>45.8%</TableCell>
                        <TableCell>3.9%</TableCell>
                        <TableCell>1m 28s</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Other</TableCell>
                        <TableCell>295</TableCell>
                        <TableCell>415</TableCell>
                        <TableCell>48.2%</TableCell>
                        <TableCell>3.5%</TableCell>
                        <TableCell>1m 12s</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technology" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>Users by device category</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="h-full bg-muted rounded-md animate-pulse" />
                  ) : (
                    <ChartContainer className="h-full" config={chartConfig}>
                      <PieChart>
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Device</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].name}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Visitors</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].payload.users?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Percentage</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].value}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Pie
                          data={mockDeviceData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                        >
                          {mockDeviceData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={colorMap[entry.name as keyof typeof colorMap]} 
                            />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Browser Usage</CardTitle>
                  <CardDescription>Users by browser type</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="h-full bg-muted rounded-md animate-pulse" />
                  ) : (
                    <ChartContainer className="h-full" config={chartConfig}>
                      <BarChart data={mockBrowserData}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Browser</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].name}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Visitors</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].payload.users?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Percentage</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].value}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          radius={[4, 4, 0, 0]}
                        >
                          {mockBrowserData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={colorMap[entry.name as keyof typeof colorMap] || colorMap.Other} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Technology Breakdown</CardTitle>
                <CardDescription>Complete overview of user technology</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Device</TableHead>
                          <TableHead>Browser</TableHead>
                          <TableHead>Operating System</TableHead>
                          <TableHead>Screen Size</TableHead>
                          <TableHead>Users</TableHead>
                          <TableHead>Sessions</TableHead>
                          <TableHead>Bounce Rate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Desktop</TableCell>
                          <TableCell>Chrome</TableCell>
                          <TableCell>Windows</TableCell>
                          <TableCell>1920x1080</TableCell>
                          <TableCell>2,850</TableCell>
                          <TableCell>4,120</TableCell>
                          <TableCell>35.4%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Desktop</TableCell>
                          <TableCell>Safari</TableCell>
                          <TableCell>macOS</TableCell>
                          <TableCell>1440x900</TableCell>
                          <TableCell>1,245</TableCell>
                          <TableCell>1,850</TableCell>
                          <TableCell>32.1%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mobile</TableCell>
                          <TableCell>Safari</TableCell>
                          <TableCell>iOS</TableCell>
                          <TableCell>390x844</TableCell>
                          <TableCell>1,490</TableCell>
                          <TableCell>2,340</TableCell>
                          <TableCell>42.8%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Mobile</TableCell>
                          <TableCell>Chrome</TableCell>
                          <TableCell>Android</TableCell>
                          <TableCell>412x915</TableCell>
                          <TableCell>1,260</TableCell>
                          <TableCell>1,980</TableCell>
                          <TableCell>45.2%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Tablet</TableCell>
                          <TableCell>Safari</TableCell>
                          <TableCell>iPadOS</TableCell>
                          <TableCell>768x1024</TableCell>
                          <TableCell>415</TableCell>
                          <TableCell>580</TableCell>
                          <TableCell>38.6%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="behavior" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visits by Time of Day</CardTitle>
                  <CardDescription>Traffic distribution over 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="h-full bg-muted rounded-md animate-pulse" />
                  ) : (
                    <ChartContainer className="h-full" config={chartConfig}>
                      <LineChart data={mockTimeData}>
                        <XAxis 
                          dataKey="hour"
                          tickFormatter={(value) => `${value}:00`}
                        />
                        <YAxis />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="flex flex-col space-y-1">
                                    <span className="text-muted-foreground text-[10px]">Hour</span>
                                    <span className="font-bold text-xs">
                                      {payload[0].payload.hour}:00 - {payload[0].payload.hour + 1}:00
                                    </span>
                                    <span className="text-muted-foreground text-[10px]">Visits</span>
                                    <span className="font-bold text-xs">
                                      {payload[0].value}
                                    </span>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="visits" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Session Duration</CardTitle>
                  <CardDescription>Time spent on site distribution</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {loading ? (
                    <div className="h-full bg-muted rounded-md animate-pulse" />
                  ) : (
                    <ChartContainer className="h-full" config={chartConfig}>
                      <BarChart data={mockSessionData}>
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `${value}%`} />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Duration</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].name}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Users</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].payload.users?.toLocaleString()}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-muted-foreground text-[10px]">Percentage</span>
                                      <span className="font-bold text-xs">
                                        {payload[0].value}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill="#a855f7"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>Most visited pages by audience</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-10 bg-muted rounded-md animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead>Pageviews</TableHead>
                        <TableHead>Unique Users</TableHead>
                        <TableHead>Avg. Time on Page</TableHead>
                        <TableHead>Bounce Rate</TableHead>
                        <TableHead>Exit Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">/homepage</TableCell>
                        <TableCell>3,245</TableCell>
                        <TableCell>2,850</TableCell>
                        <TableCell>1m 32s</TableCell>
                        <TableCell>42.3%</TableCell>
                        <TableCell>28.1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">/product</TableCell>
                        <TableCell>2,180</TableCell>
                        <TableCell>1,920</TableCell>
                        <TableCell>2m 47s</TableCell>
                        <TableCell>18.7%</TableCell>
                        <TableCell>15.4%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">/pricing</TableCell>
                        <TableCell>1,654</TableCell>
                        <TableCell>1,480</TableCell>
                        <TableCell>1m 53s</TableCell>
                        <TableCell>22.5%</TableCell>
                        <TableCell>34.2%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">/blog</TableCell>
                        <TableCell>1,248</TableCell>
                        <TableCell>1,120</TableCell>
                        <TableCell>3m 12s</TableCell>
                        <TableCell>35.1%</TableCell>
                        <TableCell>25.8%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">/contact</TableCell>
                        <TableCell>876</TableCell>
                        <TableCell>790</TableCell>
                        <TableCell>1m 05s</TableCell>
                        <TableCell>12.4%</TableCell>
                        <TableCell>42.7%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6 mt-6">
            <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
              <div className="text-center">
                <h3 className="text-lg font-medium">Demographics Data Coming Soon</h3>
                <p className="text-muted-foreground mt-2">
                  This feature will be available in the next update
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="space-y-6 mt-6">
            <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
              <div className="text-center">
                <h3 className="text-lg font-medium">Traffic Sources Coming Soon</h3>
                <p className="text-muted-foreground mt-2">
                  This feature will be available in the next update
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-6 mt-6">
            <div className="flex items-center justify-center h-64 border border-dashed rounded-md">
              <div className="text-center">
                <h3 className="text-lg font-medium">Engagement Metrics Coming Soon</h3>
                <p className="text-muted-foreground mt-2">
                  This feature will be available in the next update
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Audience;
