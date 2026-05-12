import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAppStore } from "@/lib/store";
import { useState } from "react";
import { Plus, Trash2, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Clientes — Sharks Flow" },
      { name: "description", content: "Gerencie clientes da agência." },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  const clients = useAppStore((s) => s.clients);
  const boards = useAppStore((s) => s.boards);
  const addClient = useAppStore((s) => s.addClient);
  const deleteClient = useAppStore((s) => s.deleteClient);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    segment: "",
    status: "ativo" as const,
    owner: "",
    description: "",
  });

  return (
    <AppShell>
      <header className="flex items-center justify-between border-b border-border px-8 py-5">
        <div>
          <h1 className="text-xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Cada cliente possui sua própria arquitetura visual.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          style={{ boxShadow: "var(--shadow-glow-sm)" }}
        >
          <Plus className="h-4 w-4" /> Novo cliente
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-3 gap-4">
          {clients.map((c) => {
            const count = boards.filter((b) => b.clientId === c.id).length;
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-border bg-card p-5"
                style={{ background: "var(--gradient-surface)" }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {c.segment || "—"}
                    </div>
                    <div className="mt-1 text-lg font-semibold">{c.name}</div>
                  </div>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider"
                    style={{
                      background:
                        c.status === "ativo"
                          ? "color-mix(in oklab, var(--primary) 20%, transparent)"
                          : "var(--muted)",
                      color: c.status === "ativo" ? "var(--primary-glow)" : "var(--muted-foreground)",
                    }}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">
                  {c.description || "Sem descrição."}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{count} board(s)</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm(`Excluir ${c.name}?`)) deleteClient(c.id);
                      }}
                      className="rounded p-1 hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <Link
                      to="/clients/$clientId"
                      params={{ clientId: c.id }}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      abrir <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
              addClient(form);
              setForm({ name: "", segment: "", status: "ativo", owner: "", description: "" });
              setOpen(false);
            }}
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6"
            style={{ boxShadow: "var(--shadow-elevated)" }}
          >
            <h2 className="text-lg font-semibold">Novo cliente</h2>
            <div className="mt-4 space-y-3">
              <Field label="Nome">
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                />
              </Field>
              <Field label="Segmento">
                <input
                  className="input"
                  value={form.segment}
                  onChange={(e) => setForm({ ...form, segment: e.target.value })}
                />
              </Field>
              <Field label="Responsável">
                <input
                  className="input"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                />
              </Field>
              <Field label="Descrição">
                <textarea
                  className="input min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
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
                Criar
              </button>
            </div>
            <style>{`.input{width:100%;background:var(--input);border:1px solid var(--border);border-radius:0.5rem;padding:0.5rem 0.75rem;font-size:0.875rem;color:var(--foreground);outline:none}.input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent)}`}</style>
          </form>
        </div>
      )}
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
