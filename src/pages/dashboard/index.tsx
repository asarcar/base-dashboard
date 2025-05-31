// services/frontend/dashboard/src/pages/dashboard/index.tsx
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { dashboardPanes } from '@/constants/panes';
import { Input } from '@/components/ui/input';
import { Terminal } from 'lucide-react';
import PageHead from '@/components/shared/page-head';
import { useState } from 'react';
import RecentSales from '@/components/recent-sales';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  return (
    <>
      <PageHead title="Dashboard | App" />
      <div className="max-h-screen flex-1 space-y-4 overflow-y-auto p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back! 👋
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">108</div>
                  <p className="text-xs text-muted-foreground">
                    -20% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed Issues
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+280</div>
                  <p className="text-xs text-muted-foreground">
                    +175% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Main Content */}
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-3">
          <Input placeholder="Search..." className="w-1/2 text-sm" />
          <div className="flex items-center space-x-3">
            <Button variant="ghost" className="text-sm">
              Help
            </Button>
            <div className="h-6 w-6 rounded-full bg-gray-300"></div>
          </div>
        </div>

        {/* Task Board */}
        <div className="grid flex-1 grid-cols-5 gap-3 overflow-y-auto bg-gray-100 p-3">
          {dashboardPanes.map((pane) => (
            <div
              key={pane.title}
              className="rounded-md bg-white p-3 text-black shadow"
              // Adding role="list" to the container of the list items
              // This makes the entire pane a semantic list
              role="list"
            >
              <h2 className="text-md mb-1 text-center font-semibold">
                {pane.title}
              </h2>
              {pane.content.map((item, index) => (
                <Card
                  key={index}
                  className="mb-1 last:mb-0"
                  // ADDED: role="listitem" for semantic meaning and testability
                  role="listitem"
                >
                  {' '}
                  {/* Added spacing */}
                  <CardContent className="flex flex-col items-center p-2">
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs">{item.details}</div>
                    <Button className="mt-1 text-xs" size="xs">
                      {item.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
