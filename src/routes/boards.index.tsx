import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAppStore, BOARD_TYPE_LABEL } from "@/lib/store";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/boards/")({
  head: () => ({
    meta: [
      { title: "Boards — Sharks Flow" },
      { name: "description", content: "Mapas visuais por cliente." },
    ],
  }),
  component: BoardsList,
});

function BoardsList() {
  const boards = useAppStore((s) => s.boards);
  const clients = useAppStore((s) => s.clients);

  return (
    <AppShell>
      <header className="border-b border-border px-8 py-5">
        <h1 className="text-xl font-semibold">Boards</h1>
        <p className="text-sm text-muted-foreground">Todos os mapas visuais da agência.</p>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-2 gap-3">
          {boards.map((b) => {
            const c = clients.find((x) => x.id === b.clientId);
            return (
              <Link
                key={b.id}
                to="/boards/$boardId"
                params={{ boardId: b.id }}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/60"
                style={{ background: "var(--gradient-surface)" }}
              >
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {c?.name ?? "—"} · {BOARD_TYPE_LABEL[b.type]}
                  </div>
                  <div className="mt-1 font-medium">{b.name}</div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
