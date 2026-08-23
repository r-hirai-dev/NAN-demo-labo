"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, type KeyboardEvent } from "react";
import { navigationItems } from "@/content/navigation";

/**
 * サイト全体のヘッダー。スキップリンク、サイトマーク、単一のプライマリナビゲー
 * ションランドマークで構成される。モバイル用のトグルは `md` ブレークポイント
 * 未満での CSS の表示・非表示（`hidden` と `block`）を切り替えるだけであり、
 * `md:block` がそのブレークポイント以上では常に優先されるため、デスクトップ用
 * とモバイル用を別々に複製せずとも、どのビューポート幅でも DOM 上の `nav`
 * ランドマークは常に1つだけになる。
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuId = useId();

  const closeMenu = () => setIsMenuOpen(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isMenuOpen) {
      closeMenu();
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <div
        className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4"
        onKeyDown={handleKeyDown}
      >
        <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Personal Engineering Lab
        </Link>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded border border-slate-300 p-2 text-slate-700 md:hidden dark:border-slate-700 dark:text-slate-200"
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{isMenuOpen ? "✕" : "☰"}</span>
          <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
        </button>
        <nav
          id={menuId}
          aria-label="Primary"
          className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={closeMenu}
                    className={`block rounded px-2 py-1 text-sm font-medium ${
                      isActive
                        ? "text-slate-950 underline underline-offset-4 dark:text-white"
                        : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
