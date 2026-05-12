import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Edge, Node } from "reactflow";

export type BoardType =
  | "marketing-funnel"
  | "sales-funnel"
  | "automation"
  | "customer-journey"
  | "internal-process";

export interface Client {
  id: string;
  name: string;
  segment: string;
  status: "ativo" | "pausado" | "prospect";
  owner: string;
  description: string;
  createdAt: string;
}

export interface Board {
  id: string;
  clientId: string;
  name: string;
  type: BoardType;
  description: string;
  status: "rascunho" | "ativo" | "arquivado";
  createdAt: string;
  updatedAt: string;
  nodes: Node[];
  edges: Edge[];
}

export interface NodeBlockData {
  label: string;
  category: string;
  subtype?: string;
  icon?: string;
  color?: string;
  notes?: string;
}

interface State {
  clients: Client[];
  boards: Board[];
  addClient: (c: Omit<Client, "id" | "createdAt">) => Client;
  updateClient: (id: string, patch: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addBoard: (b: Omit<Board, "id" | "createdAt" | "updatedAt" | "nodes" | "edges">) => Board;
  updateBoard: (id: string, patch: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  saveBoardGraph: (id: string, nodes: Node[], edges: Edge[]) => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

const seedClient: Client = {
  id: "demo-client",
  name: "Cliente Demo",
  segment: "E-commerce",
  status: "ativo",
  owner: "Sharks Team",
  description: "Cliente exemplo para visualizar a estrutura de funil e automações.",
  createdAt: new Date().toISOString(),
};

const seedBoard: Board = {
  id: "demo-board",
  clientId: "demo-client",
  name: "Funil de Aquisição",
  type: "marketing-funnel",
  description: "Mapa visual do funil principal de captação.",
  status: "ativo",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  nodes: [
    {
      id: "n1",
      type: "block",
      position: { x: 80, y: 120 },
      data: { label: "Instagram", category: "Canais", subtype: "Orgânico", color: "#E1306C" },
    },
    {
      id: "n2",
      type: "block",
      position: { x: 380, y: 60 },
      data: { label: "Landing Page", category: "Canais", subtype: "Site" },
    },
    {
      id: "n3",
      type: "block",
      position: { x: 380, y: 220 },
      data: { label: "WhatsApp", category: "Canais", subtype: "Atendimento", color: "#25D366" },
    },
    {
      id: "n4",
      type: "block",
      position: { x: 700, y: 140 },
      data: { label: "CRM", category: "Ferramentas", subtype: "Pipeline" },
    },
    {
      id: "n5",
      type: "block",
      position: { x: 1000, y: 140 },
      data: { label: "Conversão", category: "Etapas", subtype: "Venda" },
    },
  ],
  edges: [
    { id: "e1", source: "n1", target: "n2" },
    { id: "e2", source: "n1", target: "n3" },
    { id: "e3", source: "n2", target: "n4" },
    { id: "e4", source: "n3", target: "n4" },
    { id: "e5", source: "n4", target: "n5" },
  ],
};

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      clients: [seedClient],
      boards: [seedBoard],
      addClient: (c) => {
        const client: Client = { ...c, id: uid(), createdAt: new Date().toISOString() };
        set({ clients: [...get().clients, client] });
        return client;
      },
      updateClient: (id, patch) =>
        set({ clients: get().clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }),
      deleteClient: (id) =>
        set({
          clients: get().clients.filter((c) => c.id !== id),
          boards: get().boards.filter((b) => b.clientId !== id),
        }),
      addBoard: (b) => {
        const now = new Date().toISOString();
        const board: Board = {
          ...b,
          id: uid(),
          createdAt: now,
          updatedAt: now,
          nodes: [],
          edges: [],
        };
        set({ boards: [...get().boards, board] });
        return board;
      },
      updateBoard: (id, patch) =>
        set({
          boards: get().boards.map((b) =>
            b.id === id ? { ...b, ...patch, updatedAt: new Date().toISOString() } : b,
          ),
        }),
      deleteBoard: (id) => set({ boards: get().boards.filter((b) => b.id !== id) }),
      saveBoardGraph: (id, nodes, edges) =>
        set({
          boards: get().boards.map((b) =>
            b.id === id ? { ...b, nodes, edges, updatedAt: new Date().toISOString() } : b,
          ),
        }),
    }),
    {
      name: "sharks-flow-store-v2",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as unknown as Storage),
      ),
      skipHydration: true,
    },
  ),
);

// Manual rehydration — avoids SSR/CSR mismatch.
if (typeof window !== "undefined") {
  void useAppStore.persist.rehydrate();
}

export const BOARD_TYPE_LABEL: Record<BoardType, string> = {
  "marketing-funnel": "Funil de Marketing",
  "sales-funnel": "Funil de Vendas",
  automation: "Fluxo de Automação",
  "customer-journey": "Jornada do Cliente",
  "internal-process": "Processo Interno",
};
