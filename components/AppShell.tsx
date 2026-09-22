"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const nav = [
  { href: "/", label: "Library" },
  { href: "/ask/", label: "Ask Keel" },
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
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#243041]/80 bg-[#07080b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#4aa3ff] text-[#07080b] font-semibold">
                K
              </span>
              <span className="text-[15px] font-semibold tracking-tight">Keel</span>
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
                    className={`rounded-full px-3 py-1.5 text-[13px] ${
                      active
                        ? "bg-[#181f2a] text-white"
                        : "text-[#8b97a8] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-[#5B8CFF] text-[12px] font-semibold lg:hidden">
              AC
            </span>
          </div>
          <form onSubmit={onSearch} className="flex min-w-0 flex-1">
            <input
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search meetings, quotes, actions…"
              className="w-full rounded-full border border-[#243041] bg-[#12171f] px-4 py-2 text-[13px] outline-none placeholder:text-[#667384] focus:border-[#4aa3ff]"
            />
          </form>
          <div className="hidden items-center gap-2 lg:flex">
            <span className="rounded-full border border-[#243041] bg-[#12171f] px-2.5 py-1 text-[11px] text-[#8b97a8]">
              Calendar connected
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#5B8CFF] text-[12px] font-semibold">
              AC
            </span>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">{children}</main>
    </div>
  );
}
