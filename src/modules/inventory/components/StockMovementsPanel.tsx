import { useState, type CSSProperties } from "react";
import { Text, Select, Modal, Button, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Panel } from "@/shared/components/Panel";
import { useProductsList, useCreateProduct } from "../hooks/useProducts";
import { useCreateStockMovement } from "../hooks/useStockMovements";
import { useDeviceCategoriesList } from "../hooks/useDeviceCategories";

const inputStyle: CSSProperties = {
  width: 64,
  backgroundColor: "#0f110d",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 6,
  color: "var(--text)",
  fontFamily: "var(--font-mono)",
  fontSize: 12,
  padding: "4px 8px",
};

const pillButtonBase: CSSProperties = {
  borderRadius: 100,
  padding: "6px 12px",
  fontSize: 12,
  cursor: "pointer",
  fontFamily: "var(--font-body)",
};

export function StockMovementsPanel() {
  const { data } = useProductsList({ page: 1, perPage: 50 });
  const { data: categories } = useDeviceCategoriesList();
  const createMovement = useCreateStockMovement();
  const createProduct = useCreateProduct();

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [tally, setTally] = useState<Record<string, { purchased: number; used: number }>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [newPart, setNewPart] = useState({ name: "", deviceCategoryId: "" as string | null });

  const products = data?.data ?? [];

  const getQty = (productId: string) => quantities[productId] ?? 1;
  const getTally = (productId: string) => tally[productId] ?? { purchased: 0, used: 0 };

  function handleMovement(productId: string, productName: string, type: "IN" | "OUT") {
    const quantity = getQty(productId);
    createMovement.mutate(
      { productId, dto: { type, quantity, reason: type === "IN" ? "Compra" : "Uso em conserto" } },
      {
        onSuccess: () => {
          setTally((prev) => {
            const current = getTally(productId);
            return {
              ...prev,
              [productId]: {
                purchased: current.purchased + (type === "IN" ? quantity : 0),
                used: current.used + (type === "OUT" ? quantity : 0),
              },
            };
          });
          notifications.show({
            color: "accent",
            title: type === "IN" ? "Compra registrada" : "Uso registrado",
            message: `${quantity} un. de "${productName}" ${type === "IN" ? "adicionadas ao" : "baixadas do"} estoque.`,
          });
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            "Não foi possível registrar a movimentação.";
          notifications.show({ color: "danger", title: "Erro", message: String(message) });
        },
      },
    );
  }

  function handleRegisterPart() {
    if (!newPart.name.trim()) return;
    createProduct.mutate(
      {
        name: newPart.name.trim(),
        deviceCategoryId: newPart.deviceCategoryId || undefined,
        minStock: 1,
      },
      {
        onSuccess: () => {
          setNewPart({ name: "", deviceCategoryId: "" });
          setModalOpen(false);
          notifications.show({
            color: "accent",
            title: "Peça cadastrada",
            message: `"${newPart.name.trim()}" foi adicionada ao estoque.`,
          });
        },
        onError: (error: unknown) => {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            "Não foi possível cadastrar a peça.";
          notifications.show({ color: "danger", title: "Erro", message: String(message) });
        },
      },
    );
  }

  return (
    <Panel>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <Text style={{ fontSize: 14, fontWeight: 600 }}>Controle de peças — compra x consumo</Text>
        <Button size="xs" color="accent" onClick={() => setModalOpen(true)}>
          + Nova peça
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 0.8fr 1.6fr",
          gap: 8,
          fontSize: 11.5,
          fontFamily: "var(--font-mono)",
          color: "var(--text-muted-dark)",
          paddingBottom: 8,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span>PEÇA</span>
        <span>CATEGORIA</span>
        <span>COMPRADO</span>
        <span>USADO</span>
        <span>SALDO</span>
        <span>AÇÕES</span>
      </div>

      {products.length === 0 ? (
        <Text style={{ fontSize: 13, color: "var(--text-muted)", padding: "12px 0" }}>
          Nenhuma peça cadastrada.
        </Text>
      ) : (
        products.map((product, index) => {
          const rowTally = getTally(product.id);
          return (
            <div
              key={product.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 0.8fr 0.8fr 0.8fr 1.6fr",
                gap: 8,
                alignItems: "center",
                padding: "10px 0",
                borderBottom: index === products.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <Text style={{ fontSize: 13 }}>{product.name}</Text>
              <Text style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>{product.categoryName}</Text>
              <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                {rowTally.purchased}
              </Text>
              <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)", color: "var(--danger)" }}>
                {rowTally.used}
              </Text>
              <Text style={{ fontSize: 12.5, fontFamily: "var(--font-mono)" }}>{product.quantity}</Text>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  type="number"
                  min={1}
                  style={inputStyle}
                  value={getQty(product.id)}
                  onChange={(e) =>
                    setQuantities((prev) => ({ ...prev, [product.id]: Number(e.target.value) || 1 }))
                  }
                />
                <button
                  type="button"
                  onClick={() => handleMovement(product.id, product.name, "IN")}
                  disabled={createMovement.isPending}
                  style={{
                    ...pillButtonBase,
                    backgroundColor: "rgba(76,125,255,0.1)",
                    border: "1px solid rgba(76,125,255,0.3)",
                    color: "var(--accent)",
                  }}
                >
                  + compra
                </button>
                <button
                  type="button"
                  onClick={() => handleMovement(product.id, product.name, "OUT")}
                  disabled={createMovement.isPending}
                  style={{
                    ...pillButtonBase,
                    backgroundColor: "rgba(255,122,92,0.1)",
                    border: "1px solid rgba(255,122,92,0.3)",
                    color: "var(--danger)",
                  }}
                >
                  - uso
                </button>
              </div>
            </div>
          );
        })
      )}

      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Cadastrar nova peça">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <TextInput
            label="Nome da peça"
            placeholder="ex.: Botão de controle PS4"
            value={newPart.name}
            onChange={(e) => setNewPart((prev) => ({ ...prev, name: e.target.value }))}
            data-autofocus
          />
          <Select
            label="Categoria (opcional)"
            placeholder="Selecione"
            data={(categories ?? []).map((c) => ({ value: c.id, label: c.name }))}
            value={newPart.deviceCategoryId}
            onChange={(value) => setNewPart((prev) => ({ ...prev, deviceCategoryId: value ?? "" }))}
            clearable
          />
          <Button
            color="accent"
            onClick={handleRegisterPart}
            loading={createProduct.isPending}
            disabled={!newPart.name.trim()}
          >
            Salvar peça
          </Button>
        </div>
      </Modal>
    </Panel>
  );
}
