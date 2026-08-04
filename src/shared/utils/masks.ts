/** Formats digits as a Brazilian phone number while typing: (00) 0000-0000
 * for landlines (10 digits) or (00) 00000-0000 for mobiles (11 digits). */
export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/** Formats digits as a CPF (000.000.000-00, 11 digits) or CNPJ
 * (00.000.000/0000-00, 14 digits) while typing, based on length so far. */
export function maskDocument(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

/** Groups a 15-digit IMEI while typing: 00 000000 000000 0 (matches the
 * industry-standard TAC / FAC / serial / check-digit layout). */
export function maskImei(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 15);
  const parts = [digits.slice(0, 2), digits.slice(2, 8), digits.slice(8, 14), digits.slice(14, 15)];
  return parts.filter(Boolean).join(" ");
}
