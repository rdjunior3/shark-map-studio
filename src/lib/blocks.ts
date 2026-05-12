export interface BlockTemplate {
  label: string;
  subtype?: string;
  color?: string;
}

export interface BlockCategory {
  name: string;
  description: string;
  items: BlockTemplate[];
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    name: "Canais",
    description: "Origem de tráfego e pontos de contato",
    items: [
      { label: "Instagram", color: "#E1306C" },
      { label: "Facebook", color: "#1877F2" },
      { label: "TikTok", color: "#69C9D0" },
      { label: "Google", color: "#4285F4" },
      { label: "YouTube", color: "#FF0000" },
      { label: "WhatsApp", color: "#25D366" },
      { label: "Email" },
      { label: "Site" },
      { label: "Landing Page" },
      { label: "Blog" },
      { label: "iFood", color: "#EA1D2C" },
      { label: "Marketplace" },
    ],
  },
  {
    name: "Ferramentas",
    description: "Stack operacional do cliente",
    items: [
      { label: "CRM" },
      { label: "Automação" },
      { label: "RD Station", color: "#1A73E8" },
      { label: "HubSpot", color: "#FF7A59" },
      { label: "Zapier", color: "#FF4A00" },
      { label: "Make", color: "#6D00CC" },
      { label: "Notion" },
      { label: "Meta Ads", color: "#1877F2" },
      { label: "Google Ads", color: "#4285F4" },
      { label: "Bot / IA" },
      { label: "Checkout" },
      { label: "ERP" },
    ],
  },
  {
    name: "Etapas",
    description: "Estágios do funil",
    items: [
      { label: "Atração" },
      { label: "Captação" },
      { label: "Nutrição" },
      { label: "Qualificação" },
      { label: "Conversão" },
      { label: "Retenção" },
      { label: "Reativação" },
      { label: "Fidelização" },
    ],
  },
  {
    name: "Processos",
    description: "Operação e workflows",
    items: [
      { label: "Atendimento" },
      { label: "Follow-up" },
      { label: "Remarketing" },
      { label: "Automação de Lead" },
      { label: "Pós-venda" },
      { label: "Campanhas" },
      { label: "Onboarding" },
      { label: "Suporte" },
    ],
  },
];
