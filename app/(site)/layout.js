"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "मुख्यपृष्ठ" },
  { href: "/list", label: "आरत्या" },
  { href: "/categories", label: "श्रेणी" },
  { href: "/favorites", label: "आवडत्या" },
  { href: "/settings", label: "सेटिंग्ज" },
];

export default function SiteLayout({ children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("no-scroll", menuOpen);
  }, [menuOpen]);

  // Close the mobile menu on route change.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand">
            <span className="om">ॐ</span> आरती संग्रहालय
          </Link>
          <nav className="main-nav" aria-label="मुख्य दुवे">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname === link.href ? "is-active" : ""}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="icon-btn menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="मेनू उघडा"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>

      <nav id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-label="मोबाइल मेनू">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={pathname === link.href ? "is-active" : ""}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container">
          <p className="footer-brand">आरती संग्रहालय</p>
          <p className="footer-tagline">भक्ती • परंपरा • संस्कृती</p>
          <div className="footer-links">
            <Link href="/">मुख्यपृष्ठ</Link>
            <Link href="/list">आरत्या</Link>
            <Link href="/categories">श्रेणी</Link>
            <Link href="/favorites">आवडत्या</Link>
            <Link href="/about">आमच्याबद्दल</Link>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Developed by <a href="https://virajpate.great-site.net/" target="_blank" rel="noopener noreferrer">Viraj Pate</a></p>
        </div>
      </footer>
    </>
  );
}
