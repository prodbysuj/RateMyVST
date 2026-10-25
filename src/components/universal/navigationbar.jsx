"use client";

import { useState, Suspense } from "react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import styles from "./navigationbar.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default function NavigationBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        {/* Logo */}
        <a href="/" className={styles.logo}>
          RateMy<span>VST</span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>

        {/* Desktop auth controls */}
        <div className={styles.authControls}>
          <Suspense>
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button type="button" className={styles.ctaSecondary}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button type="button" className={styles.cta}>Sign Up</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </Suspense>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles.hamburger}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.open : ""}`} role="dialog" aria-label="Navigation menu">
        {NAV_LINKS.map(({ label, href }) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
        <button type="button" className={styles.drawerCta} onClick={() => setMenuOpen(false)}>
          Submit a Plugin
        </button>
        <div className={styles.drawerAuth}>
          <Suspense>
            <Show when="signed-out">
              <SignInButton mode="redirect">
                <button type="button" className={styles.ctaSecondary} onClick={() => setMenuOpen(false)}>Sign In</button>
              </SignInButton>
              <SignUpButton mode="redirect">
                <button type="button" className={styles.drawerCta} onClick={() => setMenuOpen(false)}>Sign Up</button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </Suspense>
        </div>
      </div>
    </>
  );
}
