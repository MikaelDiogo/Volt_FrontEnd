import { StatusBadge } from "@/shared/components/StatusBadge";
import { ServiceOrderStatus } from "../types/service-order.types";

const LABELS: Record<ServiceOrderStatus, string> = {
  [ServiceOrderStatus.PENDING]: "Aberta",
  [ServiceOrderStatus.IN_REPAIR]: "Em Reparo",
  [ServiceOrderStatus.READY]: "Pronta",
  [ServiceOrderStatus.DELIVERED]: "Entregue",
  [ServiceOrderStatus.CANCELLED]: "Cancelada",
};

export function ServiceOrderStatusBadge({ status }: { status: ServiceOrderStatus }) {
  return <StatusBadge status={status} label={LABELS[status]} />;
}
