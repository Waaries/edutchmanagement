import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import { AppGlow } from "@/components/ui/app-surface";

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  const { user } = useAuth();

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="dashboard-dark min-h-screen flex w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col relative">
          {/* Top bar with sidebar trigger */}
          <header className="h-14 flex items-center justify-between px-4 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="text-slate-200 hover:bg-white/10">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <h1 className="font-semibold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                eDutch Management
              </h1>
            </div>

            {user && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
                <span>Welkom, <span className="text-slate-200">{user.email}</span></span>
              </div>
            )}
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto relative">
            <AppGlow />
            <div className="relative z-10">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
