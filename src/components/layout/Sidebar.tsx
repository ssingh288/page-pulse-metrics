
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  FileText,
  BarChart2,
  Upload,
  Settings,
  PlusCircle,
  User,
  LogOut,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem = ({
  icon: Icon,
  label,
  href,
  active = false,
  onClick,
}: NavItemProps) => (
  <Link
    to={href}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-accent",
      active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
    )}
  >
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </Link>
);

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  const isPartialActive = (path: string) => location.pathname.startsWith(path);

  return (
    <aside className="hidden w-64 flex-col border-r p-4 md:flex min-h-screen">
      <div className="flex items-center mb-10 mt-2">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-xs text-primary-foreground">PP</span>
          </div>
          <span className="text-xl font-bold">PagePulse.ai</span>
        </Link>
      </div>
      
      <div className="space-y-1">
        <NavItem
          icon={Home}
          label="Dashboard"
          href="/dashboard"
          active={isActive("/dashboard")}
        />
        <NavItem
          icon={FileText}
          label="Landing Pages"
          href="/pages"
          active={isPartialActive("/pages")}
        />
        <NavItem
          icon={Upload}
          label="Media Library"
          href="/media"
          active={isActive("/media")}
        />
        <NavItem
          icon={Sparkles}
          label="AI Content Generator"
          href="/ai-generator"
          active={isActive("/ai-generator")}
        />
      </div>
      
      <Separator className="my-4" />
      
      <div>
        <Button asChild variant="default" className="w-full justify-start mb-4">
          <Link to="/create-page">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Landing Page
          </Link>
        </Button>
      </div>
      
      <div className="mt-auto space-y-1">
        <NavItem
          icon={User}
          label="Profile"
          href="/profile"
          active={isActive("/profile")}
        />
        <NavItem
          icon={LogOut}
          label="Logout"
          href="#"
          onClick={signOut}
        />
      </div>
    </aside>
  );
}
