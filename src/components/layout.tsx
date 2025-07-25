
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  MessageSquare,
  Upload,
  Network,
  ShieldCheck,
  ScanLine,
  ListTodo,
  FileText,
  PanelLeft,
  User,
  LogOut,
  Settings,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "./ui/badge";
import { useApp } from "@/context/app-context";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/chat", label: "Vulnerability Chat", icon: MessageSquare },
  { href: "/ingest", label: "Ingest Data", icon: Upload },
  { href: "/mapping", label: "Asset Mapping", icon: Network },
  { href: "/advisor", label: "Patch Advisor", icon: ShieldCheck },
  { href: "/scan-parser", label: "Scan Parser", icon: ScanLine },
  { href: "/prioritize", label: "Prioritize Patches", icon: ListTodo },
  { href: "/reports", label: "Security Reports", icon: FileText },
];

function DateTime() {
    const [time, setTime] = React.useState('');
    const [date, setDate] = React.useState('');

    React.useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
            setDate(now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000 * 60); 

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="text-sm text-muted-foreground hidden md:block">
            <div>{time}</div>
            <div>{date}</div>
        </div>
    )
}

function UserMenu() {
    const { logout, isDemoMode, toggleDemoMode } = useApp();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    }

    return (
         <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-semibold">Admin</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    admin@patchwise.co
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex-col items-start gap-2">
                    <div className="flex items-center justify-between w-full">
                         <Label htmlFor="demo-mode" className="font-normal flex items-center gap-2 cursor-pointer">
                            <Badge variant={isDemoMode ? "secondary" : "outline"}>
                                {isDemoMode ? "DEMO" : "ACTUAL"}
                            </Badge>
                            <span>Mode</span>
                        </Label>
                        <Switch id="demo-mode" checked={isDemoMode} onCheckedChange={toggleDemoMode} />
                    </div>
                    <p className="text-xs text-muted-foreground">Toggle to see sample data.</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
    )
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useApp();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);


  if (pathname === '/login') {
    return <>{children}</>
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Logo className="size-10 animate-pulse" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarRail />
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">PatchWise</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                 <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <div className="flex items-center gap-2">
                 <Avatar className="size-8">
                    <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="text-sm font-semibold">Admin</span>
                    <span className="text-xs text-muted-foreground">admin@patchwise.co</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SidebarTrigger>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">
              {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <DateTime />
            <UserMenu />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
