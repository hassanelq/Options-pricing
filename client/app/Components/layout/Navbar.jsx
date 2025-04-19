"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import NavLink from "../ui/NavLink";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { title: "Home", path: "/" },
    { title: "Documentation", path: "/documentation" },
    { title: "Methodology", path: "/methodology" },
  ];

  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
    setMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
    document.body.classList.toggle("overflow-hidden", !menuOpen);
  };

  const mobileMenuVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: "-100%" },
  };

  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
      <nav className="custom-screen mx-auto">
        <div className="flex items-center justify-between py-4 md:py-5">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10">
                <Image src="/images/HE.svg" alt="Hassan EL QADI" fill />
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8 text-gray-600 font-medium">
              {navigation.map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.path}
                    className={`hover:text-teal-600 transition-colors px-2 py-1 rounded-lg ${
                      pathname === item.path
                        ? "text-teal-600 font-semibold"
                        : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <NavLink
              href="/Options-pricing"
              variant="gradient"
              className="px-6 py-2.5 text-sm"
            >
              Start Pricing
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="p-2 md:hidden text-gray-600 hover:text-teal-600 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 z-50 bg-white shadow-lg mt-16 p-6"
            >
              <ul className="space-y-6 text-lg text-gray-600 font-medium">
                {navigation.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Link
                      href={item.path}
                      className={`block px-4 py-2 rounded-lg transition-colors ${
                        pathname === item.path
                          ? "text-teal-600 font-semibold"
                          : "hover:text-teal-600"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6">
                <NavLink
                  href="/Options-pricing"
                  variant="gradient"
                  className="w-full text-center py-3 text-sm"
                >
                  Start Pricing
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Navbar;
