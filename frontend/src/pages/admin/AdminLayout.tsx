import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { COMPANY } from "@/lib/utils/constants";
import { useState } from "react";
import { LayoutDashboard, Home, ClipboardList, Users, Star, LogOut, Globe } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Home },
  { label: "Leads", href: "/admin/leads", icon: ClipboardList },
  { label: "Agents", href: "/admin/agents", icon: Users },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await signOut();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-neutral-200 bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-4">
          <img src="/brand/logo.jpeg" alt="" className="h-8 w-auto" />
          <span className="font-bold text-neutral-900">{COMPANY.shortName}</span>
          <span className="ml-auto text-xs text-neutral-400">Admin</span>
        </div>
        <nav className="mt-4 space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const isActive = link.href === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
          <a href="/" target="_blank" className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50">
            <Globe className="h-4 w-4" /> View Site
          </a>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="p-2 lg:hidden">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-neutral-900">
            {sidebarLinks.find((l) => location.pathname === l.href)?.label || "Admin"}
          </h2>
        </header>
        <div className="p-4 lg:p-6"><Outlet /></div>
      </div>
    </div>
  );
}
