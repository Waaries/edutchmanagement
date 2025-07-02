import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top bar with sidebar trigger */}
          <header className="h-14 flex items-center justify-between px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <SidebarTrigger>
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <h1 className="font-semibold text-lg">eDutch Management</h1>
            </div>
            
            {user && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Welkom, {user.email}</span>
              </div>
            )}
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}