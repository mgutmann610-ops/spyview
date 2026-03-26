import type { Page } from "@/App";
import {
  Activity,
  Bell,
  Mic,
  Monitor,
  Radio,
  Settings,
  Smartphone,
  User,
} from "lucide-react";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; icon: ReactNode; label: string }[] = [
  { id: "devices", icon: <Smartphone className="w-5 h-5" />, label: "Devices" },
  { id: "logs", icon: <Activity className="w-5 h-5" />, label: "Activity" },
  { id: "screen", icon: <Monitor className="w-5 h-5" />, label: "Screen" },
  { id: "audio", icon: <Mic className="w-5 h-5" />, label: "Audio" },
  { id: "settings", icon: <Settings className="w-5 h-5" />, label: "Settings" },
];

export default function Layout({
  children,
  currentPage,
  onNavigate,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-spy-bg flex flex-col">
      <header className="sticky top-0 z-50 h-14 bg-spy-header border-b border-spy-border flex items-center px-4 gap-4">
        <div className="flex items-center gap-2 mr-4">
          <Radio className="w-5 h-5 text-spy-teal" />
          <span className="text-spy-text font-bold tracking-widest uppercase text-sm">
            SpyView
          </span>
        </div>

        <nav
          className="hidden md:flex items-center gap-1"
          data-ocid="nav.panel"
        >
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                currentPage === item.id
                  ? "bg-spy-teal/15 text-spy-teal border border-spy-teal/30"
                  : "text-spy-muted hover:text-spy-text hover:bg-spy-card"
              }`}
              data-ocid={`nav.${item.id}.link`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex-1" />

        <button
          type="button"
          className="w-8 h-8 rounded-lg bg-spy-card border border-spy-border flex items-center justify-center text-spy-muted hover:text-spy-text transition-colors relative"
          data-ocid="header.notifications.button"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-spy-red" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-spy-card border border-spy-border">
          <User className="w-4 h-4 text-spy-teal" />
          <span className="text-xs text-spy-text font-semibold">Admin</span>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-14 bg-spy-header border-r border-spy-border flex flex-col items-center py-4 gap-2">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => onNavigate(item.id)}
              title={item.label}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                currentPage === item.id
                  ? "bg-spy-teal/20 text-spy-teal"
                  : "text-spy-muted hover:text-spy-text hover:bg-spy-card"
              }`}
              data-ocid={`sidebar.${item.id}.link`}
            >
              {item.icon}
            </button>
          ))}
        </aside>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>

      <footer className="border-t border-spy-border px-6 py-3 flex items-center justify-between">
        <span className="text-xs text-spy-muted">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="hover:text-spy-teal transition-colors"
          >
            Built with ❤ using caffeine.ai
          </a>
        </span>
        <span className="text-xs text-spy-muted">SpyView v1.0.0</span>
      </footer>
    </div>
  );
}
