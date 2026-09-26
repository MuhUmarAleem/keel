"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const nav = [
  { href: "/", label: "Library" },
  { href: "/ask/", label: "Ask" },
  { href: "/calendar/", label: "Calendar" },
  { href: "/search/", label: "Search" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const bare = path.startsWith("/share/");

  function onSearch(event: FormEvent) {
    event.preventDefault();
    const value = q.trim();
    if (!value) return;
    router.push(`/search/?q=${encodeURIComponent(value)}`);
  }

  if (bare) {
    return <div className="min-h-screen bg-ink text-paper">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-30 border-b border-line bg-ink/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-serif text-[22px] leading-none tracking-tight">
              <svg viewBox="0 0 18 16" className="h-4 w-4" aria-hidden>
                <rect x="1" y="6" width="3" height="8" fill="#C99A3C" />
                <rect x="7" y="2" width="3" height="12" fill="#3E8C8A" />
                <rect x="13" y="5" width="3" height="9" fill="#D4654A" />
              </svg>
              Keel
            </Link>
            <nav className="flex flex-wrap items-center gap-1">
              {nav.map((item) => {
                const active =
                  item.href === "/"
                    ? path === "/"
                    : path.startsWith(item.href.replace(/\/$/, ""));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3 py-1 text-[14px] ${
                      active ? "bg-cue text-ink" : "text-graphite hover:bg-[#1c2128] hover:text-paper"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <form onSubmit={onSearch} className="flex min-w-0 flex-1 gap-2">
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search meetings, quotes, actions…"
              aria-label="Search meetings, quotes, actions"
              className="w-full rounded-full border border-line bg-[#1a1f27] px-4 py-1.5 text-[14px] text-paper placeholder:text-graphite"
            />
            <button className="rounded-full bg-tide px-4 py-1.5 text-[13px] font-medium text-paper">
              Search
            </button>
          </form>
          <p className="hidden items-center gap-2 rounded-full bg-[#163330] px-3 py-1 text-[13px] text-[#7dccc9] lg:flex">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-tide" aria-hidden />
            Calendar connected
          </p>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}
