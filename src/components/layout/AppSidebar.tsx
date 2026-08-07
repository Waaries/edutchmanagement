import { 
  Home, 
  User, 
  FileText, 
  Settings, 
  MessageSquare, 
  Shield,
  ChevronRight,
  LogOut
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const publicItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Contact", url: "/#contact", icon: MessageSquare },
];

const userItems = [
  { title: "Dashboard", url: "/dashboard", icon: User },
  { title: "Aanvragen", url: "/aanvragen", icon: FileText },
];

const adminItems = [
  { title: "Admin Panel", url: "/admin", icon: Shield },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-500"
      : "hover:bg-slate-100 text-slate-600 hover:text-slate-900";

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r border-slate-200`}
    >
      <div className="flex flex-col h-full bg-white">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-slate-900">eDutch Management</span>
                <span className="text-xs text-slate-500 truncate max-w-[160px]">
                  {user?.email || 'Bezoeker'}
                </span>
              </div>
            )}
            <SidebarTrigger className="ml-auto text-slate-600 hover:bg-slate-100" />
          </div>
        </div>

        <SidebarContent className="flex-1">
          {/* Public Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigatie</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {publicItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavCls}
                        onClick={(e) => {
                          if (item.url.includes('#')) {
                            e.preventDefault();
                            const element = document.querySelector(item.url.split('#')[1]);
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* User Dashboard */}
          {user && (
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {userItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Admin Panel */}
          {isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel>Administratie</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className={getNavCls}>
                          <item.icon className="h-4 w-4" />
                          {!isCollapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        {/* Footer with Sign Out */}
        {user && (
          <SidebarFooter className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Uitloggen</span>}
            </Button>
          </SidebarFooter>
        )}
      </div>
    </Sidebar>
  );
}