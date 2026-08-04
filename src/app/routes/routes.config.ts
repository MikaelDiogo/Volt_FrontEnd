import { lazy } from "react";
import {
  IconLayoutDashboard,
  IconTool,
  IconBox,
  IconCurrencyDollar,
  IconWallet,
  IconUsers,
  IconLayoutGrid,
  IconSearch,
  IconSettings,
  IconCalendar,
  IconLayoutKanban,
} from "@tabler/icons-react";

export const DashboardPage = lazy(() => import("@/modules/dashboard/pages/DashboardPage"));

export const ServiceOrdersPage = lazy(
  () => import("@/modules/service-orders/pages/ServiceOrdersPage"),
);
export const ServiceOrderDetailPage = lazy(
  () => import("@/modules/service-orders/pages/ServiceOrderDetailPage"),
);
export const KanbanPage = lazy(() => import("@/modules/service-orders/pages/KanbanPage"));

export const InventoryPage = lazy(() => import("@/modules/inventory/pages/InventoryPage"));

export const SalesPage = lazy(() => import("@/modules/sales/pages/SalesPage"));

export const FinancialPage = lazy(() => import("@/modules/financial/pages/FinancialPage"));

export const CustomersPage = lazy(() => import("@/modules/customers/pages/CustomersPage"));
export const CustomerDetailPage = lazy(
  () => import("@/modules/customers/pages/CustomerDetailPage"),
);

export const CatalogPage = lazy(() => import("@/modules/catalog/pages/CatalogPage"));

export const CalendarPage = lazy(() => import("@/modules/calendar/pages/CalendarPage"));

export const ImeiCheckPage = lazy(() => import("@/modules/imei-check/pages/ImeiCheckPage"));

export const SettingsPage = lazy(() => import("@/modules/settings/pages/SettingsPage"));

export const LoginPage = lazy(() => import("@/modules/auth/pages/LoginPage"));

export const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: IconLayoutDashboard, group: "OPERAÇÃO" },
  { path: "/ordens-servico", label: "Ordens de Serviço", icon: IconTool, group: "OPERAÇÃO" },
  { path: "/kanban", label: "Kanban de O.S.", icon: IconLayoutKanban, group: "OPERAÇÃO" },
  { path: "/estoque", label: "Estoque / IMEI", icon: IconBox, group: "OPERAÇÃO" },
  { path: "/vendas", label: "Vendas / PDV", icon: IconCurrencyDollar, group: "OPERAÇÃO" },
  { path: "/calendario", label: "Calendário", icon: IconCalendar, group: "GESTÃO" },
  { path: "/financeiro", label: "Financeiro", icon: IconWallet, group: "GESTÃO" },
  { path: "/clientes", label: "Clientes / CRM", icon: IconUsers, group: "GESTÃO" },
  { path: "/catalogo", label: "Catálogo Digital", icon: IconLayoutGrid, group: "GESTÃO" },
  { path: "/consulta-imei", label: "Consulta de IMEI", icon: IconSearch, group: "GESTÃO" },
  { path: "/configuracoes", label: "Configurações", icon: IconSettings, group: "GESTÃO" },
] as const;
