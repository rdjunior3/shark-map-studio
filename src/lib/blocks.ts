// icon = Simple Icons slug (https://cdn.simpleicons.org/<slug>)
// lucide = lucide-react icon name (fallback for non-brand items)
export interface BlockTemplate {
  label: string;
  subtype?: string;
  color?: string;
  icon?: string;
  lucide?: string;
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
      { label: "Instagram", icon: "instagram", color: "#E1306C" },
      { label: "Facebook", icon: "facebook", color: "#1877F2" },
      { label: "TikTok", icon: "tiktok", color: "#69C9D0" },
      { label: "YouTube", icon: "youtube", color: "#FF0000" },
      { label: "LinkedIn", icon: "linkedin", color: "#0A66C2" },
      { label: "X / Twitter", icon: "x", color: "#FFFFFF" },
      { label: "Threads", icon: "threads", color: "#FFFFFF" },
      { label: "Pinterest", icon: "pinterest", color: "#BD081C" },
      { label: "WhatsApp", icon: "whatsapp", color: "#25D366" },
      { label: "Telegram", icon: "telegram", color: "#26A5E4" },
      { label: "Messenger", icon: "messenger", color: "#0084FF" },
      { label: "Google", icon: "google", color: "#4285F4" },
      { label: "Gmail", icon: "gmail", color: "#EA4335" },
      { label: "Site", lucide: "Globe", color: "#60a5fa" },
      { label: "Landing Page", lucide: "LayoutTemplate", color: "#a78bfa" },
      { label: "Blog", lucide: "FileText", color: "#f59e0b" },
      { label: "iFood", icon: "ifood", color: "#EA1D2C" },
      { label: "Shopee", icon: "shopee", color: "#EE4D2D" },
      { label: "Mercado Livre", icon: "mercadolibre", color: "#FFE600" },
      { label: "Amazon", icon: "amazon", color: "#FF9900" },
      { label: "Shopify", icon: "shopify", color: "#7AB55C" },
    ],
  },
  {
    name: "Ferramentas",
    description: "Stack operacional do cliente",
    items: [
      { label: "Meta Ads", icon: "meta", color: "#0467DF" },
      { label: "Google Ads", icon: "googleads", color: "#4285F4" },
      { label: "TikTok Ads", icon: "tiktok", color: "#69C9D0" },
      { label: "RD Station", icon: "rdstation", color: "#1A73E8" },
      { label: "HubSpot", icon: "hubspot", color: "#FF7A59" },
      { label: "Salesforce", icon: "salesforce", color: "#00A1E0" },
      { label: "Pipedrive", icon: "pipedrive", color: "#1A1A1A" },
      { label: "Zapier", icon: "zapier", color: "#FF4A00" },
      { label: "Make", icon: "make", color: "#6D00CC" },
      { label: "n8n", icon: "n8n", color: "#EA4B71" },
      { label: "Notion", icon: "notion", color: "#FFFFFF" },
      { label: "Airtable", icon: "airtable", color: "#FCB400" },
      { label: "Slack", icon: "slack", color: "#4A154B" },
      { label: "Trello", icon: "trello", color: "#0079BF" },
      { label: "Mailchimp", icon: "mailchimp", color: "#FFE01B" },
      { label: "Stripe", icon: "stripe", color: "#635BFF" },
      { label: "ChatGPT", icon: "openai", color: "#10A37F" },
      { label: "CRM", lucide: "Contact2", color: "#22d3ee" },
      { label: "ERP", lucide: "Database", color: "#94a3b8" },
      { label: "Checkout", lucide: "ShoppingCart", color: "#34d399" },
      { label: "Bot / IA", lucide: "Bot", color: "#a78bfa" },
    ],
  },
  {
    name: "Etapas",
    description: "Estágios do funil",
    items: [
      { label: "Atração", lucide: "Megaphone", color: "#f59e0b" },
      { label: "Captação", lucide: "Magnet", color: "#fb923c" },
      { label: "Nutrição", lucide: "Sprout", color: "#84cc16" },
      { label: "Qualificação", lucide: "Filter", color: "#22d3ee" },
      { label: "Conversão", lucide: "Target", color: "#22c55e" },
      { label: "Retenção", lucide: "Repeat", color: "#a78bfa" },
      { label: "Reativação", lucide: "RefreshCw", color: "#f472b6" },
      { label: "Fidelização", lucide: "Heart", color: "#ef4444" },
      { label: "Upsell", lucide: "TrendingUp", color: "#10b981" },
    ],
  },
  {
    name: "Processos",
    description: "Operação e workflows",
    items: [
      { label: "Atendimento", lucide: "Headphones", color: "#60a5fa" },
      { label: "Follow-up", lucide: "Send", color: "#22d3ee" },
      { label: "Remarketing", lucide: "Rewind", color: "#f472b6" },
      { label: "Automação de Lead", lucide: "Zap", color: "#facc15" },
      { label: "Pós-venda", lucide: "PackageCheck", color: "#34d399" },
      { label: "Campanhas", lucide: "Rocket", color: "#fb923c" },
      { label: "Onboarding", lucide: "UserPlus", color: "#a78bfa" },
      { label: "Suporte", lucide: "LifeBuoy", color: "#60a5fa" },
      { label: "Relatórios", lucide: "BarChart3", color: "#94a3b8" },
    ],
  },
];
