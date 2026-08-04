const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrencyBRL(value: number): string {
  return currencyFormatter.format(value);
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string | Date, withTime = false): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "-";
  return withTime ? dateTimeFormatter.format(date) : dateFormatter.format(date);
}

/**
 * Formats a 15-digit IMEI (or similarly-shaped serial number) into
 * grouped blocks: "XX XXXXXX XXXXXX X" (2-6-6-1).
 */
export function formatImei(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 15) return raw;
  return `${digits.slice(0, 2)} ${digits.slice(2, 8)} ${digits.slice(8, 14)} ${digits.slice(14)}`;
}
