
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./Sidebar";
import { ModeToggle } from "./ModeToggle";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-4 lg:px-8">
            <h1 className="text-xl font-bold">OptimizeAI</h1>
            <div className="flex items-center space-x-2">
              <ModeToggle />
            </div>
          </header>
          <main className="flex-1">
            <div className="content-area">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
