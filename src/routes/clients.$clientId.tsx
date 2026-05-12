import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAppStore, BOARD_TYPE_LABEL, type BoardType } from "@/lib/store";
import { useState } from "react";
import { ArrowLeft, Plus, ArrowUpRight, Trash2 } from "lucide-react";

export const Route = createFileRoute("/clients/$clientId")({
  component: ClientDetail,
});

function ClientDetail() {
  const { clientId } = Route.useParams();
  const navigate = useNavigate();
  const client = useAppStore((s) => s.clients.find((c) => c.id === clientId));
  const boards = useAppStore((s) => s.boards.filter((b) => b.clientId === clientId));
  const addBoard = useAppStore((s) => s.addBoard);
  const deleteBoard = useAppStore((s) => s.deleteBoard);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "marketing-funnel" as BoardType,
    description: "",
    status: "rascunho" as const,
  });

  if (!client) {
    return (
      <AppShell>
        <div className="p-8 text-sm text-muted-foreground">
          Cliente não encontrado.{" "}
          <Link to="/clients" className="text-primary hover:underline">
            voltar
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <header className="border-b border-border px-8 py-5">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Clientes
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{client.name}</h1>
            <p className="text-sm text-muted-foreground">
              {client.segment || "—"} · {client.owner || "Sem responsável"}
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            style={{ boxShadow: "var(--shadow-glow-sm)" }}
          >
            <Plus className="h-4 w-4" /> Novo board
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {client.description && (
          <p className="mb-6 max-w-2xl text-sm text-muted-foreground">{client.description}</p>
        )}

        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">
          Boards do cliente
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {boards.map((b) => (
            <div
              key={b.id}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/60"
              style={{ background: "var(--gradient-surface)" }}
            >
              <Link
                to="/boards/$boardId"
                params={{ boardId: b.id }}
                className="flex-1"
              >
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {BOARD_TYPE_LABEL[b.type]}
                </div>
                <div className="mt-1 font-medium">{b.name}</div>
                {b.description && (
                  <div className="mt-1 text-xs text-muted-foreground">{b.description}</div>
                )}
              </Link>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (confirm(`Excluir board ${b.name}?`)) deleteBoard(b.id);
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
            </div>
          ))}
          {boards.length === 0 && (
            <div className="col-span-2 rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Nenhum board criado para este cliente ainda.
            </div>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault();
              if (!form.name) return;
              const created = addBoard({ ...form, clientId });
              setOpen(false);
              navigate({ to: "/boards/$boardId", params: { boardId: created.id } });
            }}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <h2 className="text-lg font-semibold">Novo board</h2>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Nome
                </span>
                <input
                  autoFocus
                  className="board-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Tipo
                </span>
                <select
                  className="board-input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as BoardType })}
                >
                  {Object.entries(BOARD_TYPE_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
                  Descrição
                </span>
                <textarea
                  className="board-input min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Criar e abrir
              </button>
            </div>
            <style>{`.board-input{width:100%;background:var(--input);border:1px solid var(--border);border-radius:0.5rem;padding:0.5rem 0.75rem;font-size:0.875rem;color:var(--foreground);outline:none}.board-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent)}`}</style>
          </form>
        </div>
      )}
    </AppShell>
  );
}
