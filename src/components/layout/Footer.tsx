import { CONTACT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-[#d9d9d9]" style={{ padding: "clamp(2rem,4vw,3rem) clamp(0.5rem,5vw,7.75rem)" }}>
      <div className="max-w-[80rem] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm opacity-35">
        <p>&copy; 2026 아세아 비행교육원</p>
        <p>{CONTACT.location} · {CONTACT.phone}</p>
      </div>
    </footer>
  );
}
