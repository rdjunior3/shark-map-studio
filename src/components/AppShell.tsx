import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Users, Workflow, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clients", label: "Clientes", icon: Users },
  { to: "/boards", label: "Boards", icon: Workflow },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="flex w-60 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2 px-5 py-5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow-sm)" }}
          >
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Sharks Flow</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              by Sharks Company
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active =
              item.to === "/" ? path === "/" : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                style={{
                  background: active ? "var(--sidebar-accent)" : "transparent",
                  color: active ? "var(--foreground)" : "var(--muted-foreground)",
                  boxShadow: active ? "inset 2px 0 0 var(--primary)" : undefined,
                }}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-5 py-4 text-[10px] uppercase tracking-wider text-muted-foreground">
          v0.1 · MVP
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}
