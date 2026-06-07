import "reactflow/dist/style.css";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeMouseHandler,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Save, Trash2, Copy, Search } from "lucide-react";
import { useAppStore, BOARD_TYPE_LABEL, type NodeBlockData } from "@/lib/store";
import { BLOCK_CATEGORIES } from "@/lib/blocks";
import { BlockNode, BlockIcon } from "@/components/BlockNode";

export const Route = createFileRoute("/boards/$boardId")({
  component: BoardCanvasPage,
});

const nodeTypes = { block: BlockNode };

function BoardCanvasPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando canvas...
      </div>
    );
  }
  return (
    <ReactFlowProvider>
      <BoardCanvas />
    </ReactFlowProvider>
  );
}

function BoardCanvas() {
  const { boardId } = Route.useParams();
  const navigate = useNavigate();
  const board = useAppStore((s) => s.boards.find((b) => b.id === boardId));
  const client = useAppStore((s) => s.clients.find((c) => c.id === board?.clientId));
  const saveBoardGraph = useAppStore((s) => s.saveBoardGraph);

  const [nodes, setNodes, onNodesChange] = useNodesState(board?.nodes ?? []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(board?.edges ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const initializedRef = useRef<string | null>(null);

  // Initialize graph from store once per board (handles async rehydration).
  useEffect(() => {
    if (!board) return;
    if (initializedRef.current === board.id) return;
    initializedRef.current = board.id;
    setNodes(board.nodes);
    setEdges(board.edges);
    requestAnimationFrame(() => fitView({ padding: 0.2, duration: 300 }));
  }, [board, setNodes, setEdges, fitView]);

  // Auto-save on changes
  useEffect(() => {
    if (!board) return;
    const t = setTimeout(() => {
      saveBoardGraph(board.id, nodes, edges);
      setSavedAt(new Date().toLocaleTimeString());
    }, 600);
    return () => clearTimeout(t);
  }, [nodes, edges, board, saveBoardGraph]);

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge({ ...c, animated: true }, eds)),
    [setEdges],
  );

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => setSelectedId(node.id), []);
  const onPaneClick = useCallback(() => setSelectedId(null), []);

  const selected = useMemo(() => nodes.find((n) => n.id === selectedId) ?? null, [
    nodes,
    selectedId,
  ]);

  const updateSelected = (patch: Partial<NodeBlockData>) => {
    if (!selectedId) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedId ? { ...n, data: { ...(n.data as NodeBlockData), ...patch } } : n,
      ),
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedId && e.target !== selectedId));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const newNode: Node = {
      ...selected,
      id: Math.random().toString(36).slice(2, 10),
      position: { x: selected.position.x + 40, y: selected.position.y + 40 },
      selected: false,
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const onDragStart = (e: React.DragEvent, payload: { label: string; category: string; subtype?: string; color?: string; icon?: string; lucide?: string }) => {
    e.dataTransfer.setData("application/json", JSON.stringify(payload));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/json");
    if (!raw) return;
    const data = JSON.parse(raw);
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const newNode: Node<NodeBlockData> = {
      id: Math.random().toString(36).slice(2, 10),
      type: "block",
      position,
      data,
    };
    setNodes((nds) => [...nds, newNode as Node]);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const filteredCategories = BLOCK_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((i) => i.label.toLowerCase().includes(search.toLowerCase())),
  })).filter((c) => c.items.length > 0);

  if (!board) {
    return (
      <AppShellLite>
        <div className="p-8 text-sm text-muted-foreground">
          Board não encontrado.{" "}
          <Link to="/" className="text-primary hover:underline">
            voltar
          </Link>
        </div>
      </AppShellLite>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Topbar */}
      <header className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: "/clients/$clientId", params: { clientId: board.clientId } })}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {client?.name ?? "—"} · {BOARD_TYPE_LABEL[board.type]}
            </div>
            <div className="text-sm font-semibold">{board.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {savedAt && <span>salvo às {savedAt}</span>}
          <button
            onClick={() => {
              saveBoardGraph(board.id, nodes, edges);
              setSavedAt(new Date().toLocaleTimeString());
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            style={{ boxShadow: "var(--shadow-glow-sm)" }}
          >
            <Save className="h-3.5 w-3.5" /> Salvar
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Library */}
        <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
          {/* Search */}
          <div className="shrink-0 border-b border-border/60 p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar bloco..."
                className="w-full rounded-xl border border-border/60 bg-background/60 py-2 pl-9 pr-3 text-xs text-foreground outline-none ring-0 transition-all placeholder:text-muted-foreground/40 focus:border-primary/60 focus:bg-background focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Scrollable categories */}
          <div className="library-scroll flex-1 overflow-y-auto px-3 py-4">
            {filteredCategories.map((cat) => (
              <div key={cat.name} className="mb-6 last:mb-0">
                {/* Category header */}
                <div className="mb-3 flex items-center gap-2 px-1">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    {cat.name}
                  </div>
                  <div className="ml-auto inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground/80">
                    {cat.items.length}
                  </div>
                </div>

                {/* Items grid */}
                <div className="grid grid-cols-2 gap-2">
                  {cat.items.map((item) => (
                    <div
                      key={item.label}
                      draggable
                      onDragStart={(e) =>
                        onDragStart(e, {
                          label: item.label,
                          category: cat.name,
                          subtype: item.subtype,
                          color: item.color,
                          icon: item.icon,
                          lucide: item.lucide,
                        })
                      }
                      title={item.label}
                      className="group relative flex cursor-grab flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-3 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)] active:cursor-grabbing"
                      style={{
                        boxShadow: "0 1px 2px 0 rgba(0,0,0,0.15)",
                      }}
                    >
                      {/* Glow backdrop on hover */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(120px circle at 50% 30%, color-mix(in oklab, ${item.color ?? "#60a5fa"} 18%, transparent), transparent)`,
                        }}
                      />

                      {/* Icon container */}
                      <div
                        className="relative flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-sm transition-transform duration-200 group-hover:scale-110"
                        style={{
                          background: `color-mix(in oklab, ${item.color ?? "#60a5fa"} 12%, var(--card))`,
                          borderColor: `color-mix(in oklab, ${item.color ?? "#60a5fa"} 30%, transparent)`,
                          boxShadow: `0 0 20px -6px color-mix(in oklab, ${item.color ?? "#60a5fa"} 40%, transparent)`,
                        }}
                      >
                        <BlockIcon icon={item.icon} lucide={item.lucide} color={item.color ?? "#60a5fa"} size={20} />
                      </div>

                      {/* Label */}
                      <span className="relative z-10 line-clamp-1 text-center text-[10px] font-medium text-foreground/80 group-hover:text-foreground">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer hint */}
          <div className="shrink-0 border-t border-border/60 p-3">
            <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-3 py-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
                <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                </svg>
              </div>
              <span className="text-[10px] leading-snug text-muted-foreground/70">
                Arraste blocos para o canvas
              </span>
            </div>
          </div>
        </aside>

        {/* Canvas */}
        <div ref={wrapperRef} className="relative flex-1" onDrop={onDrop} onDragOver={onDragOver}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="oklch(0.32 0.025 250)" />
            <Controls showInteractive={false} />
            <MiniMap pannable zoomable nodeColor={() => "oklch(0.65 0.2 245)"} maskColor="oklch(0.16 0.02 250 / 0.6)" />
          </ReactFlow>
        </div>

        {/* Inspector */}
        <aside className="w-72 overflow-y-auto border-l border-border bg-sidebar p-4">
          {selected ? (
            <Inspector
              key={selected.id}
              data={selected.data as NodeBlockData}
              onChange={updateSelected}
              onDelete={deleteSelected}
              onDuplicate={duplicateSelected}
            />
          ) : (
            <BoardInfo
              boardName={board.name}
              clientName={client?.name ?? "—"}
              boardType={BOARD_TYPE_LABEL[board.type]}
              nodeCount={nodes.length}
              edgeCount={edges.length}
            />
          )}
        </aside>
      </div>
    </div>
  );
}

function AppShellLite({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen items-center justify-center bg-background">{children}</div>;
}

function BoardInfo({
  boardName,
  clientName,
  boardType,
  nodeCount,
  edgeCount,
}: {
  boardName: string;
  clientName: string;
  boardType: string;
  nodeCount: number;
  edgeCount: number;
}) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        Board atual
      </div>
      <div className="mt-1 text-base font-semibold">{boardName}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">
        {clientName} · {boardType}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Stat label="Blocos" value={nodeCount} />
        <Stat label="Conexões" value={edgeCount} />
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Selecione um bloco para editar suas propriedades, ou arraste novos blocos da biblioteca à esquerda.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function Inspector({
  data,
  onChange,
  onDelete,
  onDuplicate,
}: {
  data: NodeBlockData;
  onChange: (p: Partial<NodeBlockData>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Bloco selecionado
        </div>
        <div className="mt-1 text-sm font-semibold">{data.label}</div>
      </div>

      <Field label="Nome">
        <input
          className="ins-input"
          value={data.label}
          onChange={(e) => onChange({ label: e.target.value })}
        />
      </Field>

      <Field label="Categoria">
        <select
          className="ins-input"
          value={data.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          {["Canais", "Ferramentas", "Etapas", "Processos", "Customizados"].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Subtipo">
        <input
          className="ins-input"
          value={data.subtype ?? ""}
          onChange={(e) => onChange({ subtype: e.target.value })}
        />
      </Field>

      <Field label="Cor de destaque">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={data.color ?? "#3b82f6"}
            onChange={(e) => onChange({ color: e.target.value })}
            className="h-8 w-8 cursor-pointer rounded border border-border bg-transparent"
          />
          <input
            className="ins-input flex-1"
            value={data.color ?? ""}
            onChange={(e) => onChange({ color: e.target.value })}
            placeholder="auto"
          />
        </div>
      </Field>

      <Field label="Observações">
        <textarea
          className="ins-input min-h-[80px]"
          value={data.notes ?? ""}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </Field>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onDuplicate}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs hover:border-primary/50"
        >
          <Copy className="h-3.5 w-3.5" /> Duplicar
        </button>
        <button
          onClick={onDelete}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive hover:bg-destructive/20"
        >
          <Trash2 className="h-3.5 w-3.5" /> Excluir
        </button>
      </div>

      <style>{`.ins-input{width:100%;background:var(--input);border:1px solid var(--border);border-radius:0.5rem;padding:0.4rem 0.6rem;font-size:0.8rem;color:var(--foreground);outline:none}.ins-input:focus{border-color:var(--primary);box-shadow:0 0 0 3px color-mix(in oklab, var(--primary) 20%, transparent)}`}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
