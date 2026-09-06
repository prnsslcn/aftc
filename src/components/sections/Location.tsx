import Link from "next/link";

/* Location — 찾아오시는 길.
   한 화면(100dvh)에 담기게 컴팩트 레이아웃.
   Naver 는 iframe embed 를 차단하므로 지도는 Google Maps embed 로 렌더,
   '지도 열기' 링크만 네이버로 연결. 다크 톤을 위해 invert + hue-rotate 필터. */

const MAP_ADDRESS = "서울특별시 영등포구 당산로32길 16";
const GOOGLE_MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  MAP_ADDRESS
)}&z=17&output=embed`;
const NAVER_MAP_LINK = `https://map.naver.com/p/search/${encodeURIComponent(
  "아세아항공직업전문학교"
)}`;

export default function Location() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col bg-[#0a0a0a] text-[#fafaf8] px-6 md:px-10 lg:px-16 pt-24 pb-10 md:pt-28 md:pb-14">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col">
        {/* Header + Address — 인라인 컴팩트 */}
        <div className="mb-8 md:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <h2
            className="font-display font-light tracking-[-0.03em] leading-[0.95] break-keep-all"
            style={{ fontSize: "clamp(2rem, 4vw, 4rem)" }}
          >
            Location
          </h2>

          <div className="md:text-right">
            <p className="text-white/45 font-mono uppercase tracking-[.22em] text-xs mb-2">
              Address
            </p>
            <p className="font-semibold text-lg md:text-xl leading-snug break-keep-all">
              아세아항공직업전문학교
            </p>
            <p className="text-white/70 mt-1 leading-relaxed break-keep-all">
              {MAP_ADDRESS}
            </p>
          </div>
        </div>

        {/* Map — flex-1 로 남은 공간 채움, 다크 필터 적용 */}
        <div className="relative flex-1 min-h-[280px] rounded-2xl overflow-hidden border border-white/10">
          <iframe
            src={GOOGLE_MAP_EMBED_URL}
            title="아세아항공직업전문학교 위치"
            className="absolute inset-0 w-full h-full border-0"
            style={{
              filter:
                "invert(92%) hue-rotate(180deg) saturate(0.75) brightness(0.95) contrast(0.9)",
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          {/* 상단·모서리 vignette 로 map 을 다크 배경에 자연스럽게 융화 */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: "inset 0 0 80px rgba(10,10,10,0.55)",
            }}
          />
          <a
            href={NAVER_MAP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute right-4 bottom-4 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-full text-xs text-white/90 font-medium tracking-wide hover:bg-black transition-colors z-10"
          >
            네이버 지도에서 열기 →
          </a>
        </div>
      </div>

      {/* 관리자 로그인 진입점 — 우측 하단 조용히 */}
      <Link
        href="/admin/login"
        className="absolute right-4 bottom-4 md:right-6 md:bottom-6 text-[10px] md:text-xs font-mono uppercase tracking-[.22em] text-white/25 hover:text-white/70 transition-colors"
      >
        Admin
      </Link>
    </section>
  );
}
