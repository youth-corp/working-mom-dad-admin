// 개인정보 마스킹 — admin AGENTS.md "Do" 룰에 따라 표시 단계에서 적용.

export function maskName(name: string): string {
  if (!name) return "";
  const trimmed = name.trim();
  if (trimmed.length <= 1) return trimmed;
  if (trimmed.length === 2) return `${trimmed[0]}*`;
  return `${trimmed[0]}${"*".repeat(trimmed.length - 1)}`;
}

export function maskId(id: string): string {
  if (!id) return "";
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

export function maskEmail(email: string): string {
  if (!email) return "";
  const at = email.indexOf("@");
  if (at < 0) return email;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const localMask =
    local.length <= 3 ? `${local[0] ?? ""}***` : `${local.slice(0, 3)}***`;
  const dotIdx = domain.indexOf(".");
  const domainMask =
    dotIdx > 0 ? `*${domain.slice(dotIdx)}` : "*";
  return `${localMask}@${domainMask}`;
}
