"use client";

// components/Footer.js
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const Footer = () => (
  <footer className="bg-gradient-to-b from-gray-50 to-teal-50 border-t border-gray-200">
    <div className="custom-screen py-12">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-teal-500">
              <Image
                src="/images/me.jpeg" // Add your profile image
                alt="Hassan EL QADI"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">
                Hassan EL QADI
              </h3>
              <p className="text-sm text-gray-600">
                Financial Engineering student
              </p>
            </div>
          </div>
          <p className="text-gray-600 text-sm">
            Building quantitative tools and financial models to democratize
            access to sophisticated financial analysis.
          </p>
        </motion.div>

        {/* Project Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 gap-4 md:pl-12"
        >
          <div className="space-y-3">
            <h4 className="text-gray-800 font-semibold">Project</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/Options-pricing"
                  className="text-gray-600 hover:text-teal-600 transition text-sm"
                >
                  Pricing Models
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="text-gray-600 hover:text-teal-600 transition text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/methodology"
                  className="text-gray-600 hover:text-teal-600 transition text-sm"
                >
                  Methodology
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-gray-800 font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/hassanelq/Options-pricing"
                  className="text-gray-600 hover:text-teal-600 transition text-sm"
                  target="_blank"
                  rel="noopener"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a
                  href="/report"
                  className="text-gray-600 hover:text-teal-600 transition text-sm"
                >
                  Project report
                </a>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-4 md:text-right"
        >
          <h4 className="text-gray-800 font-semibold">Connect</h4>
          <div className="flex gap-4 md:justify-end">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/el-qadi/"
              target="_blank"
              rel="noopener"
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-teal-500 transition-all hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 text-[#0A66C2]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
              </svg>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com/hassanelq"
              target="_blank"
              rel="noopener"
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-teal-500 transition-all hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.89.83.09-.65.34-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V19c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
            </a>

            {/* Portfolio */}
            <a
              href="https://www.elqadi.me"
              target="_blank"
              rel="noopener"
              className="p-2 rounded-full bg-white border border-gray-200 hover:border-teal-500 transition-all hover:-translate-y-1"
            >
              <svg
                className="w-5 h-5 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      <div className="mt-8 pt-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} Option Pricing Dashboard. Open source
          under MIT License.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
