export type GroupId =
  | "vale-cai"
  | "vale-sinos"
  | "poa-rm"
  | "macro-metropolitana"
  | "macro-centro-oriental"
  | "macro-centro-ocidental"
  | "macro-noroeste"
  | "macro-nordeste"
  | "macro-sudeste"
  | "macro-sudoeste";

export type WhatsGroup = {
  id: GroupId;
  name: string;
  shortLabel: string;
  category: "vale" | "macro";
  /** Substitua pelo link real do WhatsApp quando o grupo estiver criado */
  whatsappUrl: string;
};

export const GROUPS: Record<GroupId, WhatsGroup> = {
  "vale-cai": {
    id: "vale-cai",
    name: "Vale do Caí",
    shortLabel: "Vale do Caí",
    category: "vale",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_VALE_CAI",
  },
  "vale-sinos": {
    id: "vale-sinos",
    name: "Vale dos Sinos",
    shortLabel: "Vale dos Sinos",
    category: "vale",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_VALE_SINOS",
  },
  "poa-rm": {
    id: "poa-rm",
    name: "Porto Alegre e Região Metropolitana",
    shortLabel: "POA e Região Metropolitana",
    category: "vale",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_POA_RM",
  },
  "macro-metropolitana": {
    id: "macro-metropolitana",
    name: "Macrorregião Metropolitana",
    shortLabel: "Metropolitana",
    category: "macro",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_MACRO_METROPOLITANA",
  },
  "macro-centro-oriental": {
    id: "macro-centro-oriental",
    name: "Macrorregião Centro Oriental",
    shortLabel: "Centro Oriental",
    category: "macro",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_MACRO_CENTRO_ORIENTAL",
  },
  "macro-centro-ocidental": {
    id: "macro-centro-ocidental",
    name: "Macrorregião Centro Ocidental",
    shortLabel: "Centro Ocidental",
    category: "macro",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_MACRO_CENTRO_OCIDENTAL",
  },
  "macro-noroeste": {
    id: "macro-noroeste",
    name: "Macrorregião Noroeste",
    shortLabel: "Noroeste",
    category: "macro",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_MACRO_NOROESTE",
  },
  "macro-nordeste": {
    id: "macro-nordeste",
    name: "Macrorregião Nordeste",
    shortLabel: "Nordeste",
    category: "macro",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_MACRO_NORDESTE",
  },
  "macro-sudeste": {
    id: "macro-sudeste",
    name: "Macrorregião Sudeste",
    shortLabel: "Sudeste",
    category: "macro",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_MACRO_SUDESTE",
  },
  "macro-sudoeste": {
    id: "macro-sudoeste",
    name: "Macrorregião Sudoeste",
    shortLabel: "Sudoeste",
    category: "macro",
    whatsappUrl: "https://chat.whatsapp.com/PLACEHOLDER_MACRO_SUDOESTE",
  },
};

export const GROUP_LIST = Object.values(GROUPS);
