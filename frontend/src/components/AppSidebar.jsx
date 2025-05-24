import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar as ShadSidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../components/ui/sidebar";

// Icons
import { LayoutDashboardIcon, BarChartIcon, FolderIcon, HomeIcon } from "lucide-react";

export default function AppSidebar({ chatHistory = [] }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Handler for new chat icon
  const handleNewChat = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <ShadSidebar collapsible>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full px-2">
          <img src="/icons/sidebar-icon.svg" alt="App Icon" className="w-6 h-6" />
          <button
            className="p-1 rounded-full hover:bg-gray-100 transition"
            aria-label="New Chat"
            onClick={handleNewChat}
          >
            <img src="/icons/newChat.svg" alt="New Chat" className="w-6 h-6" />
          </button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="mt-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/home"
                className={`flex items-center gap-3 px-2 py-2 rounded-lg ${location.pathname === "/home" ? "bg-gray-200" : ""}`}
              >
                <HomeIcon className="w-5 h-5" /> Home
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/overview"
                className={`flex items-center gap-3 px-2 py-2 rounded-lg ${location.pathname === "/overview" ? "bg-gray-200" : ""}`}
              >
                <BarChartIcon className="w-5 h-5" /> Overview
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                to="/budget"
                className={`flex items-center gap-3 px-2 py-2 rounded-lg ${location.pathname === "/budget" ? "bg-gray-200" : ""}`}
              >
                <FolderIcon className="w-5 h-5" /> Budget
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* Recent Conversations */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center gap-3 px-4 mb-4">
            <img src="/icons/previous-chats-icon.svg" alt="Previous chats" className="w-5 h-5" />
            <span className="text-black font-medium">Previous Chats</span>
          </div>
          <ul className="flex flex-col gap-2 px-4">
            {chatHistory.length === 0 ? (
              <li className="text-gray-400 text-sm italic">No conversations yet.</li>
            ) : (
              chatHistory.map((chat, index) => (
                <li key={index}>
                  <Link
                    to="/chat"
                    state={{ initialMessage: chat.firstMessage }}
                    className="block p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
                  >
                    <div className="text-sm font-medium truncate">{chat.firstMessage}</div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      </SidebarContent>
      <SidebarFooter>{/* Optionally add user info here */}</SidebarFooter>
    </ShadSidebar>
  );
} 