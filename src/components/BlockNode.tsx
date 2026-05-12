import { Handle, Position, type NodeProps } from "reactflow";
import type { NodeBlockData } from "@/lib/store";

const CATEGORY_ACCENT: Record<string, string> = {
  Canais: "var(--primary)",
  Ferramentas: "oklch(0.7 0.18 180)",
  Etapas: "oklch(0.75 0.18 80)",
  Processos: "oklch(0.7 0.2 310)",
  Customizados: "var(--primary-glow)",
};

export function BlockNode({ data, selected }: NodeProps<NodeBlockData>) {
  const accent = data.color ?? CATEGORY_ACCENT[data.category] ?? "var(--primary)";
  return (
    <div
      className="group relative min-w-[180px] rounded-xl border bg-card/90 backdrop-blur-sm px-4 py-3 transition-all"
      style={{
        borderColor: selected ? accent : "var(--border)",
        boxShadow: selected
          ? `0 0 0 1px ${accent}, 0 0 24px -4px ${accent}`
          : "0 4px 16px -8px oklch(0 0 0 / 0.5)",
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {data.category}
        </span>
      </div>
      <div className="mt-1 text-sm font-semibold text-foreground">{data.label}</div>
      {data.subtype && (
        <div className="mt-0.5 text-xs text-muted-foreground">{data.subtype}</div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
