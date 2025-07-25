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
} from "lucide-react";
import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "./icons";
import { Button } from "./ui/button";

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

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <span className="text-lg font-semibold">PatchWise</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
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
        <SidebarFooter className="p-4"></SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger asChild>
             <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SidebarTrigger>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">
                {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
