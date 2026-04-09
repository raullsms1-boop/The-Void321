/*
 * Layout Component — "Midnight Cinema" Design
 * Rich charcoal background, crimson accents, gold highlights
 * Playfair Display for branding, Source Sans 3 for UI
 * Film grain texture, frosted glass nav
 * Includes auth state: login/signup or user avatar
 */
import { Link, useLocation } from "wouter";
import { Film, Gamepad2, Upload, Menu, X, Shield, LogIn, LogOut, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/movies", label: "Movies", icon: Film },
  { href: "/games", label: "Video Games", icon: Gamepad2 },
  { href: "/upload", label: "Upload", icon: Upload },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, isAuthenticated, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/movies") return location === "/" || location === "/movies";
    return location === href;
  };

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <span className="font-serif text-2xl font-bold tracking-tight text-foreground">
              THE <span className="text-crimson">VOID</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-crimson/15 text-crimson"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* Auth Section */}
            <div className="ml-3 pl-3 border-l border-border/50">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
              ) : isAuthenticated && user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-crimson" />
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                      {user.name || user.email || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                    title="Sign out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-crimson hover:bg-crimson-light text-white text-sm px-4 py-2 flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border/50 overflow-hidden"
            >
              <div className="container py-3 flex flex-col gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link key={item.href} href={item.href}>
                      <span
                        className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                          active
                            ? "bg-crimson/15 text-crimson"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}

                {/* Mobile Auth */}
                <div className="mt-2 pt-2 border-t border-border/30">
                  {loading ? (
                    <div className="px-4 py-3">
                      <div className="w-24 h-4 bg-secondary rounded animate-pulse" />
                    </div>
                  ) : isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-crimson/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-crimson" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {user.name || user.email || "User"}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-crimson hover:bg-crimson/10 transition-all w-full"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In / Sign Up
                    </button>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-void-deep/50">
        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <span className="font-serif text-xl font-bold text-foreground">
                THE <span className="text-crimson">VOID</span>
              </span>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
                A free community platform for sharing and enjoying movies and video games.
                Upload, watch, play, and connect.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wider">
                Explore
              </h4>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <span className="text-sm text-muted-foreground hover:text-crimson transition-colors">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-semibold text-sm text-foreground mb-3 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-crimson" />
                Community Policies
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We have zero tolerance for terrorism, pedophilia, rape, or any harmful content.
                Violators will be permanently banned. Keep The Void safe for everyone.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} The Void. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Free to use &middot; Community driven &middot; Policy enforced
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
