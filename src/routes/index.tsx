import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAppStore, BOARD_TYPE_LABEL } from "@/lib/store";
import { ArrowUpRight, Plus, Users, Workflow, Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const clients = useAppStore((s) => s.clients);
  const boards = useAppStore((s) => s.boards);

  const stats = [
    { label: "Clientes ativos", value: clients.filter((c) => c.status === "ativo").length, icon: Users },
    { label: "Boards criados", value: boards.length, icon: Workflow },
    { label: "Em produção", value: boards.filter((b) => b.status === "ativo").length, icon: Activity },
  ];

  return (
    <AppShell>
      <header className="flex items-center justify-between border-b border-border px-8 py-5">
        <div>
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Visão geral da operação visual da agência.
          </p>
        </div>
        <Link
          to="/clients"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
          style={{ boxShadow: "var(--shadow-glow-sm)" }}
        >
          <Plus className="h-4 w-4" /> Novo cliente
        </Link>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-3 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-5"
                style={{ background: "var(--gradient-surface)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="mt-3 text-3xl font-semibold">{s.value}</div>
              </div>
            );
          })}
        </div>

        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Boards recentes
            </h2>
            <Link to="/boards" className="text-xs text-primary hover:underline">
              ver todos
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {boards.slice(0, 6).map((b) => {
              const client = clients.find((c) => c.id === b.clientId);
              return (
                <Link
                  key={b.id}
                  to="/boards/$boardId"
                  params={{ boardId: b.id }}
                  className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/60"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {client?.name ?? "—"} · {BOARD_TYPE_LABEL[b.type]}
                    </div>
                    <div className="mt-1 font-medium">{b.name}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              );
            })}
            {boards.length === 0 && (
              <div className="col-span-2 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Nenhum board ainda. Crie um cliente e comece a mapear.
              </div>
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
