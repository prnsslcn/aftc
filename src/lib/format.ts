/* 전화번호 입력 자동 하이픈 — 숫자만 남기고 한국 번호 규칙으로 구분.
   휴대폰 010-1234-5678 (3-4-4), 서울 02-123-4567 / 02-1234-5678 (2-3-4 / 2-4-4),
   그 외 지역·인터넷전화 031-123-4567 / 031-1234-5678 (3-3-4 / 3-4-4). 최대 11자리. */
export function formatPhone(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  const areaLen = d.startsWith("02") ? 2 : 3;
  if (d.length <= areaLen) return d;
  const rest = d.slice(areaLen);
  if (rest.length <= 4) return `${d.slice(0, areaLen)}-${rest}`;
  const midLen = rest.length <= 7 ? 3 : 4;
  return `${d.slice(0, areaLen)}-${rest.slice(0, midLen)}-${rest.slice(midLen)}`;
}
