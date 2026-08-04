import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { PrivateRoute } from "./PrivateRoute";
import {
  DashboardPage,
  ServiceOrdersPage,
  ServiceOrderDetailPage,
  KanbanPage,
  InventoryPage,
  SalesPage,
  FinancialPage,
  CustomersPage,
  CustomerDetailPage,
  CatalogPage,
  CalendarPage,
  ImeiCheckPage,
  SettingsPage,
  LoginPage,
} from "./routes.config";

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "ordens-servico", element: <ServiceOrdersPage /> },
          { path: "ordens-servico/:id", element: <ServiceOrderDetailPage /> },
          { path: "kanban", element: <KanbanPage /> },
          { path: "estoque", element: <InventoryPage /> },
          { path: "vendas", element: <SalesPage /> },
          { path: "financeiro", element: <FinancialPage /> },
          { path: "clientes", element: <CustomersPage /> },
          { path: "clientes/:id", element: <CustomerDetailPage /> },
          { path: "catalogo", element: <CatalogPage /> },
          { path: "calendario", element: <CalendarPage /> },
          { path: "consulta-imei", element: <ImeiCheckPage /> },
          { path: "configuracoes", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <AuthLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
]);
