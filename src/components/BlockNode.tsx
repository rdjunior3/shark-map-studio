import { Handle, Position, type NodeProps } from "reactflow";
import * as LucideIcons from "lucide-react";
import type { NodeBlockData } from "@/lib/store";

const CATEGORY_ACCENT: Record<string, string> = {
  Canais: "#60a5fa",
  Ferramentas: "#22d3ee",
  Etapas: "#facc15",
  Processos: "#a78bfa",
  Customizados: "#f472b6",
};

export function BlockIcon({
  icon,
  lucide,
  color,
  size = 20,
}: {
  icon?: string;
  lucide?: string;
  color?: string;
  size?: number;
}) {
  if (icon) {
    // Simple Icons CDN — clean monochrome brand SVG, tinted via color
    const c = (color ?? "ffffff").replace("#", "");
    return (
      <img
        src={`https://cdn.simpleicons.org/${icon}/${c}`}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        draggable={false}
        style={{ display: "block" }}
      />
    );
  }
  if (lucide) {
    const Cmp = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>>)[lucide];
    if (Cmp) return <Cmp size={size} color={color ?? "currentColor"} strokeWidth={1.8} />;
  }
  return (
    <span
      className="inline-block rounded-full"
      style={{ width: size * 0.5, height: size * 0.5, background: color ?? "currentColor" }}
    />
  );
}

export function BlockNode({ data, selected }: NodeProps<NodeBlockData>) {
  const accent = data.color ?? CATEGORY_ACCENT[data.category] ?? "#60a5fa";
  return (
    <div
      className="group relative min-w-[200px] rounded-2xl border bg-card/95 backdrop-blur-md transition-all"
      style={{
        borderColor: selected ? accent : "color-mix(in oklab, var(--border) 80%, transparent)",
        boxShadow: selected
          ? `0 0 0 1px ${accent}, 0 8px 32px -8px ${accent}66, 0 0 0 6px ${accent}1a`
          : "0 6px 20px -10px rgba(0,0,0,0.6), 0 1px 0 0 rgba(255,255,255,0.03) inset",
      }}
    >
      {/* Accent stripe */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg, ${accent}, ${accent}33)` }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: accent, border: "2px solid var(--background)", width: 10, height: 10 }}
      />
      <div className="flex items-center gap-3 px-4 py-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
          style={{
            background: `color-mix(in oklab, ${accent} 14%, var(--card))`,
            borderColor: `color-mix(in oklab, ${accent} 35%, transparent)`,
            boxShadow: `inset 0 0 12px -4px ${accent}55`,
          }}
        >
          <BlockIcon icon={data.icon} lucide={data.lucide} color={accent} size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: accent, boxShadow: `0 0 6px ${accent}` }}
            />
            <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {data.category}
            </span>
          </div>
          <div className="mt-0.5 truncate text-sm font-semibold text-foreground">
            {data.label}
          </div>
          {data.subtype && (
            <div className="truncate text-[11px] text-muted-foreground">{data.subtype}</div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: accent, border: "2px solid var(--background)", width: 10, height: 10 }}
      />
    </div>
  );
}
