"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  UsersIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "@/config";

const menuItems = [
  { name: "Dashboard", icon: HomeIcon, path: "/admin/dashboard" },
  { name: "Manage Category", icon: BookOpenIcon, path: "/admin/categories" },
  { name: "Manage Exam", icon: ClipboardDocumentCheckIcon, path: "/admin/exams" },
  { name: "Question Bank", icon: QuestionMarkCircleIcon, path: "/admin/question-bank" },
  { name: "Manage Student", icon: UsersIcon, path: "/admin/students" },
  { name: "Leaderboard", icon: ChartBarIcon, path: "/admin/leaderboard" },
];

interface AdminSidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}
export default function AdminSidebarPage({   sidebarOpen = false, 
  setSidebarOpen = () => {}  }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = Cookies.get("jwt_token");
        const res = await axios.get(API_URL + "/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data ?? res.data;
        setUserName(data?.name || "Admin");
        setUserEmail(data?.email || null);
      } catch {
        setUserName("Admin");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  const getInitials = (name: string | null) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    return parts.length === 1
      ? parts[0].substring(0, 2).toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    try {
      const token = Cookies.get("jwt_token");
      await axios.post(API_URL + "/api/logout", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Cookies.remove("jwt_token");
      router.push("/login");
    } catch {
      alert("Logout failed, please try again.");
    }
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex flex-col h-full bg-slate-900">

      {/* Logo + Collapse Toggle */}
      <div className={`flex items-center gap-3 px-4 py-6 border-b border-slate-800 flex-shrink-0 ${isCollapsed && !isMobile ? "justify-center px-2" : ""}`}>
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
          <Image src="/images/Applogo.png" alt="Logo" width={22} height={22} priority />
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <h1 className="text-sm text-white font-bold tracking-tight truncate">ITC Mock-Exam</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold truncate">Admin Portal</p>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex-shrink-0 p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed
              ? <ChevronRightIcon className="h-4 w-4" />
              : <ChevronLeftIcon className="h-4 w-4" />
            }
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              onClick={() => isMobile && setSidebarOpen(false)}
              title={isCollapsed && !isMobile ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium group
                ${isCollapsed && !isMobile ? "justify-center px-0" : ""}
                ${isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-400"}`} />
              {(!isCollapsed || isMobile) && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className={`border-t border-slate-800 p-4 flex-shrink-0 ${isCollapsed && !isMobile ? "flex justify-center" : "flex items-center gap-3"}`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-sm flex-shrink-0 hover:bg-indigo-700 transition flex items-center justify-center">
              {loading ? "..." : getInitials(userName)}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top">
            <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
              View Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {(!isCollapsed || isMobile) && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-tight">
              {loading ? "Loading..." : userName}
            </p>
            <p className="text-[11px] text-slate-500 truncate">
              {userEmail ?? ""}
            </p>
          </div>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 w-72 max-w-[85vw] lg:hidden transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
        <SidebarContent isMobile={true} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex lg:flex-col border-r border-slate-800 flex-shrink-0
          transition-[width] duration-300 ease-in-out h-screen sticky top-0 z-20
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        <SidebarContent isMobile={false} />
      </aside>
    </>
  );
}