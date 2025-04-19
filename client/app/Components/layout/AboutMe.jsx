"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function AboutMe() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="custom-screen">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <motion.div
            className="lg:w-1/3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative h-72 w-72 mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image
                src="/images/me.jpeg"
                alt="Hassan EL QADI"
                fill
                objectFit="cover"
                className="transition-transform hover:scale-105 duration-500"
              />
            </div>
          </motion.div>

          <motion.div
            className="lg:w-2/3"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  About the Author
                </h2>
                <div className="h-1 w-20 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"></div>
              </div>

              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-500">
                Hassan EL QADI
              </h3>

              <p className="text-gray-700">
                I'm a Financial Engineer and Developer with a passion for
                quantitative finance and computational methods. My work focuses
                on building sophisticated mathematical models and making them
                accessible through intuitive user interfaces.
              </p>

              <p className="text-gray-700">
                With expertise in stochastic calculus, derivatives pricing, and
                numerical methods, I create tools that bridge the gap between
                complex financial theory and practical applications. This
                options pricing project demonstrates how powerful financial
                models can be implemented with modern web technologies.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://www.elqadi.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white py-2.5 px-6 rounded-lg shadow-sm border border-gray-200 text-teal-700 font-medium hover:shadow-md transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  Visit My Website
                </a>

                <a
                  href="https://www.linkedin.com/in/el-qadi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white py-2.5 px-6 rounded-lg shadow-sm border border-gray-200 text-blue-600 font-medium hover:shadow-md transition-all"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0H5a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h14a5 5 0 0 0 5-5V5a5 5 0 0 0-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" />
                  </svg>
                  LinkedIn
                </a>

                <a
                  href="https://github.com/hassanelq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white py-2.5 px-6 rounded-lg shadow-sm border border-gray-200 text-gray-800 font-medium hover:shadow-md transition-all"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.89.83.09-.65.34-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                  GitHub
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
