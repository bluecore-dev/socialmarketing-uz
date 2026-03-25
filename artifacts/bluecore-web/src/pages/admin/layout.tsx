import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, clearStoredToken } from "@/lib/auth-context";
import { useLogout } from "@workspace/api-client-react";
import {
  LayoutDashboard, Users, MessageSquare, FileText, Settings,
  ChevronLeft, ChevronRight, LogOut, BarChart2, Package,
  Image, Globe, Bell, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Arizalar", icon: MessageSquare },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/cases", label: "Keyslar", icon: BarChart2 },
  { href: "/admin/services", label: "Xizmatlar", icon: Package },
  { href: "/admin/users", label: "Foydalanuvchilar", icon: Users },
  { href: "/admin/banners", label: "Bannerlar", icon: Image },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoutMutation = useLogout({
    mutation: {
      onSuccess: () => {
        clearStoredToken();
        window.location.href = "/";
      },
      onError: () => {
        clearStoredToken();
        window.location.href = "/";
      },
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "manager")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Kirish taqiqlangan</h1>
          <p className="text-gray-400 mb-8">
            Bu sahifaga kirish uchun admin huquqlariga ega bo'lishingiz kerak.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
              Kirish
            </Link>
            <Link href="/" className="px-6 py-3 border border-gray-700 text-gray-300 font-bold rounded-xl hover:bg-gray-800 transition-colors">
              Bosh sahifa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location === href;
    return location.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-gray-800", collapsed && "justify-center px-2")}>
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">B</div>
        {!collapsed && (
          <div>
            <span className="text-white font-bold text-lg">BlueCore</span>
            <span className="block text-xs text-gray-500 font-medium">Admin Panel</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all",
              isActive(item.href, item.exact)
                ? "bg-primary text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="px-2 pb-4 border-t border-gray-800 pt-4 space-y-1">
        <Link
          href="/"
          className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all", collapsed && "justify-center px-2")}
        >
          <Globe className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Saytga qaytish</span>}
        </Link>
        <button
          onClick={() => logoutMutation.mutate({})}
          disabled={logoutMutation.isPending}
          className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all", collapsed && "justify-center px-2")}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Chiqish</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className={cn("hidden md:flex flex-col bg-gray-900 border-r border-gray-800 transition-all duration-300", collapsed ? "w-16" : "w-60")}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-full w-5 h-12 bg-gray-800 rounded-r-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all z-10 ml-[calc(var(--sidebar-w)-0.5rem)]"
          style={{ marginLeft: collapsed ? "3.5rem" : "14.5rem" }}
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-gray-900 border-r border-gray-800 flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-gray-900 border-b border-gray-800 px-4 md:px-6 py-4 flex items-center justify-between shrink-0">
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 hidden sm:block">{user?.email}</span>
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 text-white">
          {children}
        </main>
      </div>
    </div>
  );
}
