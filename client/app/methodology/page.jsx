"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import Script from "next/script";

export default function Methodology() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [latexLoaded, setLatexLoaded] = useState(false);

  useEffect(() => {
    // Initialize MathJax after it's loaded
    if (latexLoaded && window.MathJax) {
      window.MathJax.typesetPromise?.();
    }
  }, [latexLoaded, activeSection]); // Re-run typesetting when section changes

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      // Add timeout to allow content rendering before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        // Trigger MathJax typesetting again after scrolling
        if (latexLoaded && window.MathJax) {
          window.MathJax.typesetPromise?.();
        }
      }, 100); // Small delay
    }
  };

  // Improved LaTeX rendering functions
  const renderLatex = (formula) => {
    return `\\(${formula}\\)`;
  };

  const renderLatexBlock = (formula) => {
    return `\\[${formula}\\]`;
  };

  return (
    <>
      <Head>
        <title>Option Pricing Methodology</title>
        <meta
          name="description"
          content="Mathematical foundation of option pricing models used in the dashboard."
        />
      </Head>

      {/* MathJax configuration with improved settings */}
      <Script
        id="mathjax-config"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.MathJax = {
              tex: {
                inlineMath: [['\\\\(', '\\\\)']],
                displayMath: [['\\\\[', '\\\\]']],
                packages: ['base', 'ams', 'noerrors', 'noundefined']
              },
              svg: {
                fontCache: 'global'
              },
              options: {
                renderActions: {
                  addMenu: [],
                  checkLoading: []
                },
                skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'annotation', 'annotation-xml']
              }
            };
          `,
        }}
      />

      {/* MathJax library */}
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        strategy="afterInteractive"
        onLoad={() => setLatexLoaded(true)}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-10">
        <div className="custom-screen flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-1/4 lg:sticky lg:top-24 self-start"
          >
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200">
              <h2 className="text-xl font-bold text-teal-800 mb-4">
                Methodology Contents
              </h2>
              <nav className="space-y-1">
                {[
                  { id: "introduction", name: "Introduction" },
                  { id: "black-scholes", name: "Black-Scholes Model" },
                  { id: "heston-model", name: "Heston Model" },
                  { id: "monte-carlo", name: "Monte Carlo Methods" },
                  { id: "heston-cf", name: "Characteristic Function" },
                  { id: "calibration", name: "Model Calibration" },
                  { id: "resources", name: "Further Resources" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-teal-100 text-teal-800 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Link
                  href="/documentation"
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-800 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Back to Documentation
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:w-3/4"
          >
            <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
              <div className="mb-8 border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-teal-800 mb-3">
                  Option Pricing Methodology
                </h1>
                <p className="text-gray-600">
                  Mathematical foundations and theoretical background of the
                  option pricing models implemented in this dashboard.
                </p>
              </div>

              <div className="space-y-12">
                {/* Introduction */}
                <section id="introduction" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Introduction to Option Pricing
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Option pricing theory provides a mathematical framework
                      for determining the fair value of derivatives contracts.
                      The fundamental concept is based on no-arbitrage
                      principles, which state that in efficient markets, it
                      should be impossible to construct risk-free portfolios
                      that yield returns exceeding the risk-free rate.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg my-4">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Key Option Value Determinants
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          <strong>Underlying asset price (S)</strong>: Current
                          market price of the asset
                        </li>
                        <li>
                          <strong>Strike price (K)</strong>: Predetermined price
                          at which the option can be exercised
                        </li>
                        <li>
                          <strong>Time to expiration (T)</strong>: Remaining
                          lifespan of the option contract
                        </li>
                        <li>
                          <strong>Risk-free interest rate (r)</strong>: Return
                          on a risk-free investment over the option's lifetime
                        </li>
                        <li>
                          <strong>Volatility (σ)</strong>: Measure of the
                          underlying asset's price fluctuation
                        </li>
                        <li>
                          <strong>Dividends (q)</strong>: Cash distributions
                          from the underlying asset during the option's life
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Option Payoffs at Expiration
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <p className="mb-2 font-medium">
                        Call option (right to buy):
                      </p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `\\text{Payoff}_{\\text{call}} = \\max(S_T - K, 0)`
                          ),
                        }}
                      />

                      <p className="mt-4 mb-2 font-medium">
                        Put option (right to sell):
                      </p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `\\text{Payoff}_{\\text{put}} = \\max(K - S_T, 0)`
                          ),
                        }}
                      />

                      <p className="mt-4 text-sm">
                        Where{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("S_T"),
                          }}
                        />{" "}
                        is the price of the underlying asset at expiration time
                        T.
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Risk-Neutral Valuation
                    </h3>
                    <p>
                      The cornerstone of option pricing is the risk-neutral
                      valuation principle. It states that option prices can be
                      calculated as the expected present value of future payoffs
                      under a special probability measure (the risk-neutral
                      measure{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderLatex("\\mathbb{Q}"),
                        }}
                      />
                      ), where all assets earn the risk-free rate.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <p className="mb-2 font-medium">
                        Risk-Neutral Pricing Formula:
                      </p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `V_0 = e^{-rT} \\mathbb{E}_{\\mathbb{Q}}[ \\text{Payoff}(S_T) | \\mathcal{F}_0 ]`
                          ),
                        }}
                      />

                      <p className="mt-4 text-sm">
                        Where{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("V_0"),
                          }}
                        />{" "}
                        is the option price at time 0,
                        <span
                          dangerouslySetInnerHTML={{ __html: renderLatex("r") }}
                        />{" "}
                        is the risk-free rate,
                        <span
                          dangerouslySetInnerHTML={{ __html: renderLatex("T") }}
                        />{" "}
                        is the time to expiration, and
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex(
                              "\\mathbb{E}_{\\mathbb{Q}}[\\cdot]"
                            ),
                          }}
                        />{" "}
                        represents the expectation under the risk-neutral
                        measure given information available at time 0 (
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\mathcal{F}_0"),
                          }}
                        />
                        ).
                      </p>
                    </div>
                  </div>
                </section>

                {/* Black-Scholes Model */}
                <section id="black-scholes" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Black-Scholes Model
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Developed by Fischer Black, Myron Scholes, and Robert
                      Merton in 1973, the Black-Scholes model is the foundation
                      of modern option pricing theory, providing an elegant
                      closed-form solution for European option prices.
                    </p>

                    <div className="bg-blue-50 p-4 rounded-lg my-4">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Key Assumptions
                      </h3>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          The underlying asset price follows a geometric
                          Brownian motion with constant drift and volatility
                        </li>
                        <li>
                          Trading occurs continuously with no transaction costs
                          or taxes
                        </li>
                        <li>
                          The risk-free interest rate is constant and known
                        </li>
                        <li>
                          The market permits short-selling with full use of
                          proceeds
                        </li>
                        <li>No arbitrage opportunities exist</li>
                        <li>
                          For standard formulation: no dividends during the
                          option's life
                        </li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Model Dynamics
                    </h3>
                    <p>
                      Under the risk-neutral measure{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderLatex("\\mathbb{Q}"),
                        }}
                      />
                      , the Black-Scholes model assumes the underlying asset
                      price follows a geometric Brownian motion:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `dS_t = rS_t\\,dt + \\sigma S_t\\,dW_t^{\\mathbb{Q}}`
                          ),
                        }}
                      />

                      <p className="mt-4 text-sm">
                        Where{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("S_t"),
                          }}
                        />{" "}
                        is the asset price at time t,
                        <span
                          dangerouslySetInnerHTML={{ __html: renderLatex("r") }}
                        />{" "}
                        is the risk-free rate,
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\sigma"),
                          }}
                        />{" "}
                        is the volatility, and
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("W_t^{\\mathbb{Q}}"),
                          }}
                        />{" "}
                        is a standard Brownian motion under the risk-neutral
                        measure.
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Black-Scholes Partial Differential Equation
                    </h3>
                    <p>
                      The option price must satisfy the following partial
                      differential equation:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0`
                          ),
                        }}
                      />
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Closed-Form Solution
                    </h3>
                    <p>
                      For European options with no dividends, the Black-Scholes
                      formula provides:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <p className="mb-2 font-medium">Call option price:</p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `C(S, t) = S\\, N(d_1) - Ke^{-r(T-t)}\\, N(d_2)`
                          ),
                        }}
                      />

                      <p className="mt-4 mb-2 font-medium">Put option price:</p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `P(S, t) = Ke^{-r(T-t)}\\, N(-d_2) - S\\, N(-d_1)`
                          ),
                        }}
                      />

                      <p className="mt-4 mb-2">Where:</p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)(T-t)}{\\sigma\\sqrt{T-t}}`
                          ),
                        }}
                      />

                      <div
                        className="mt-2 overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `d_2 = d_1 - \\sigma\\sqrt{T-t}`
                          ),
                        }}
                      />

                      <p className="mt-4 text-sm">
                        And{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("N(x)"),
                          }}
                        />{" "}
                        is the cumulative distribution function of the standard
                        normal distribution.
                      </p>
                    </div>

                    <p>
                      The Black-Scholes model, despite its simplifying
                      assumptions, provides a good first approximation for
                      option prices and serves as the foundation for more
                      sophisticated models.
                    </p>
                  </div>
                </section>

                {/* Heston Model */}
                <section id="heston-model" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Heston Stochastic Volatility Model
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The Heston model, introduced by Steven Heston in 1993,
                      extends the Black-Scholes framework by allowing volatility
                      to follow its own stochastic process. This addresses a key
                      limitation of Black-Scholes by capturing empirically
                      observed phenomena like volatility clustering, mean
                      reversion, and the volatility smile.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Model Dynamics
                    </h3>
                    <p>
                      Under the risk-neutral measure, the Heston model is
                      described by two coupled stochastic differential
                      equations:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <p className="mb-2 font-medium">Asset price dynamics:</p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `dS_t = (r-q)S_t\\,dt + \\sqrt{v_t}\\,S_t\\,dW^S_t`
                          ),
                        }}
                      />

                      <p className="mt-4 mb-2 font-medium">
                        Variance dynamics:
                      </p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `dv_t = \\kappa(\\theta - v_t)\\,dt + \\xi\\sqrt{v_t}\\,dW^v_t`
                          ),
                        }}
                      />

                      <p className="mt-4 mb-2 font-medium">
                        With correlation between the Brownian motions:
                      </p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `dW^S_t\\,dW^v_t = \\rho\\,dt`
                          ),
                        }}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg my-4">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Model Parameters
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <strong>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex("v_0"),
                              }}
                            />
                          </strong>
                          : Initial variance (square of initial volatility)
                        </li>
                        <li>
                          <strong>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex("\\kappa"),
                              }}
                            />{" "}
                            (kappa)
                          </strong>
                          : Rate of mean reversion of variance - how quickly
                          volatility returns to its long-term mean
                        </li>
                        <li>
                          <strong>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex("\\theta"),
                              }}
                            />{" "}
                            (theta)
                          </strong>
                          : Long-term mean of variance - the level that
                          volatility tends toward over time
                        </li>
                        <li>
                          <strong>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex("\\xi"),
                              }}
                            />{" "}
                            (xi/volvol)
                          </strong>
                          : Volatility of variance - determines the randomness
                          in the volatility process
                        </li>
                        <li>
                          <strong>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex("\\rho"),
                              }}
                            />{" "}
                            (rho)
                          </strong>
                          : Correlation between asset returns and variance
                          changes - typically negative, capturing the leverage
                          effect
                        </li>
                      </ul>
                      <p className="mt-3 text-sm">
                        The Feller condition{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("2\\kappa\\theta > \\xi^2"),
                          }}
                        />
                        ensures that the variance process remains strictly
                        positive. While mathematically important, calibrated
                        parameters may sometimes violate this condition in
                        practice.
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Key Advantages
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        Captures volatility smiles and skews observed in options
                        markets
                      </li>
                      <li>
                        Models the negative correlation between asset returns
                        and volatility (leverage effect)
                      </li>
                      <li>Allows for mean-reversion in volatility</li>
                      <li>
                        Offers semi-analytical solutions for European options
                      </li>
                      <li>
                        Can be calibrated to match market prices across
                        different strikes and maturities
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Solution Methods
                    </h3>
                    <p>
                      Unlike Black-Scholes, the Heston model doesn't have a
                      simple closed-form solution. This application implements
                      two main approaches:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        <strong>Characteristic Function Method</strong>: A
                        semi-analytical approach using the known characteristic
                        function of the log-price under Heston, with numerical
                        integration to obtain option prices.
                      </li>
                      <li>
                        <strong>Monte Carlo Simulation</strong>: Numerical
                        simulation of price and variance paths to estimate
                        option prices, particularly useful for path-dependent
                        options.
                      </li>
                    </ol>
                  </div>
                </section>

                {/* Monte Carlo Methods */}
                <section id="monte-carlo" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Monte Carlo Methods
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Monte Carlo simulation is a powerful numerical method for
                      option pricing, especially valuable for complex models and
                      path-dependent options where closed-form solutions don't
                      exist or are difficult to compute.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      General Procedure
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg my-4">
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          Generate a large number (N) of random price paths for
                          the underlying asset using the model dynamics
                        </li>
                        <li>
                          Calculate the option payoff at maturity for each
                          simulated path
                        </li>
                        <li>
                          Average these payoffs to approximate the expected
                          payoff
                        </li>
                        <li>
                          Discount this average back to present value using the
                          risk-free rate
                        </li>
                      </ol>
                      <p className="mt-3 text-sm">
                        Mathematically, the Monte Carlo estimate of the option
                        price is:
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              `V_0 \\approx e^{-rT} \\frac{1}{N} \\sum_{i=1}^{N} \\text{Payoff}(S_T^{(i)})`
                            ),
                          }}
                        />
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Discretization Schemes
                    </h3>

                    <h4 className="text-lg font-medium text-teal-500 mb-2">
                      For Black-Scholes Model
                    </h4>
                    <p>
                      The Euler scheme for the log-price{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderLatex("X_t = \\ln(S_t)"),
                        }}
                      />{" "}
                      is:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `X_{t+\\Delta t} = X_t + (r - q - \\frac{\\sigma^2}{2})\\Delta t + \\sigma\\sqrt{\\Delta t}\\,Z`
                          ),
                        }}
                      />
                      <p className="mt-2 text-sm">
                        Where{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("Z \\sim N(0,1)"),
                          }}
                        />{" "}
                        is a standard normal random variable and{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\Delta t = T/M"),
                          }}
                        />{" "}
                        is the time step size for M steps.
                      </p>
                    </div>

                    <h4 className="text-lg font-medium text-teal-500 mb-2 mt-4">
                      For Heston Model
                    </h4>
                    <p>
                      Simulating the Heston model requires special care to
                      handle the coupled SDEs and ensure the variance remains
                      positive. Our implementation uses a Full Truncation Euler
                      scheme:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <ol className="list-decimal pl-5 space-y-3">
                        <li>
                          <strong>Generate correlated random numbers:</strong>
                          <div
                            className="overflow-x-auto mt-1"
                            dangerouslySetInnerHTML={{
                              __html: renderLatexBlock(`
                              Z_1 \\sim N(0,1) \\quad \\text{(independent)}\\\\
                              Z_2 = \\rho Z_1 + \\sqrt{1-\\rho^2}\\,Z_3 \\quad \\text{where } Z_3 \\sim N(0,1) \\text{ (independent)}
                            `),
                            }}
                          />
                        </li>
                        <li>
                          <strong>
                            Truncate variance to ensure positivity:
                          </strong>
                          <div
                            className="overflow-x-auto mt-1"
                            dangerouslySetInnerHTML={{
                              __html: renderLatexBlock(`v_t^+ = \\max(v_t, 0)`),
                            }}
                          />
                        </li>
                        <li>
                          <strong>Update variance:</strong>
                          <div
                            className="overflow-x-auto mt-1"
                            dangerouslySetInnerHTML={{
                              __html: renderLatexBlock(
                                `v_{t+\\Delta t} = v_t + \\kappa(\\theta - v_t^+)\\Delta t + \\xi\\sqrt{v_t^+}\\sqrt{\\Delta t}\\,Z_2`
                              ),
                            }}
                          />
                        </li>
                        <li>
                          <strong>Update log-price:</strong>
                          <div
                            className="overflow-x-auto mt-1"
                            dangerouslySetInnerHTML={{
                              __html: renderLatexBlock(
                                `X_{t+\\Delta t} = X_t + (r - q - \\frac{v_t^+}{2})\\Delta t + \\sqrt{v_t^+}\\sqrt{\\Delta t}\\,Z_1`
                              ),
                            }}
                          />
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3 mt-4">
                      Variance Reduction Techniques
                    </h3>
                    <p>
                      To improve efficiency and accuracy, our implementation
                      includes:
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg my-4">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <strong>Antithetic Variates:</strong> For each random
                          path, we generate its "mirror" path by negating the
                          random numbers. This reduces variance without
                          increasing computational cost.
                          <div
                            className="overflow-x-auto mt-1 text-sm"
                            dangerouslySetInnerHTML={{
                              __html: renderLatexBlock(
                                `V_0 \\approx e^{-rT} \\frac{1}{2N} \\sum_{i=1}^{N} \\left[ \\text{Payoff}(S_T^{(i,+)}) + \\text{Payoff}(S_T^{(i,-)}) \\right]`
                              ),
                            }}
                          />
                        </li>
                        <li>
                          <strong>Control Variates:</strong> Uses analytically
                          solvable variants (like Black-Scholes) as control
                          variates to reduce variance. This is particularly
                          effective for pricing Heston options when parameters
                          like volvol (ξ) or correlation (ρ) are small.
                        </li>
                        <li>
                          <strong>Quasi-Random Sequences:</strong> Sobol or
                          Halton sequences may replace pseudo-random numbers for
                          faster convergence, especially in higher dimensions.
                        </li>
                      </ul>
                    </div>

                    <p>
                      While Monte Carlo is computationally intensive compared to
                      analytical methods, it offers great flexibility for
                      complex options and models. Our implementation uses
                      vectorized operations and parallelization to improve
                      performance.
                    </p>
                  </div>
                </section>

                {/* Characteristic Function Method */}
                <section id="heston-cf" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Characteristic Function Method
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The characteristic function method provides a
                      semi-analytical approach to pricing options under the
                      Heston model. It leverages the fact that while the
                      probability density function of the asset price is not
                      known in closed form, its Fourier transform (the
                      characteristic function) is available analytically.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      The Heston Characteristic Function
                    </h3>
                    <p>
                      The characteristic function of the log-price{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: renderLatex("X_T = \\ln(S_T)"),
                        }}
                      />
                      under the Heston model has the form:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `\\phi(u) = \\mathbb{E}[e^{iuX_T}] = e^{C(u,T) + D(u,T)v_0 + iu\\ln(S_0)}`
                          ),
                        }}
                      />

                      <p className="mt-4 mb-2">
                        Where the complex-valued functions C and D are given by:
                      </p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(`
                          d = \\sqrt{(\\kappa - \\rho\\xi iu)^2 + \\xi^2(iu + u^2)}\\\\
                          g = \\frac{\\kappa - \\rho\\xi iu - d}{\\kappa - \\rho\\xi iu + d}\\\\
                          D(u,T) = \\frac{\\kappa - \\rho\\xi iu - d}{\\xi^2} \\cdot \\frac{1 - e^{-dT}}{1 - ge^{-dT}}\\\\
                          C(u,T) = (r-q)iuT + \\frac{\\kappa\\theta}{\\xi^2}\\left[(\\kappa - \\rho\\xi iu - d)T - 2\\ln\\left(\\frac{1 - ge^{-dT}}{1 - g}\\right)\\right]
                        `),
                        }}
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg my-4">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Numerical Considerations
                      </h3>
                      <p>
                        The implementation of these formulas requires careful
                        handling of:
                      </p>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>
                          Complex square roots (selecting the appropriate
                          branch)
                        </li>
                        <li>Complex logarithms (handling branch cuts)</li>
                        <li>Potential division by zero or near-zero values</li>
                        <li>Numerical overflow in exponential terms</li>
                      </ul>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Option Pricing Formula
                    </h3>
                    <p>
                      Using the characteristic function, European option prices
                      can be computed through integral representations. For call
                      options, Heston derived:
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `C(S_0, K, T) = S_0 P_1 - Ke^{-rT}P_2`
                          ),
                        }}
                      />

                      <p className="mt-4 mb-2">
                        Where the probabilities P<sub>1</sub> and P<sub>2</sub>{" "}
                        are:
                      </p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(`
                          P_j = \\frac{1}{2} + \\frac{1}{\\pi} \\int_0^\\infty \\text{Re}\\left[\\frac{e^{-iu\\ln(K)}\\phi_j(u)}{iu}\\right] du, \\quad j = 1, 2
                        `),
                        }}
                      />

                      <p className="mt-3">
                        Here,{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\phi_1(u)"),
                          }}
                        />{" "}
                        and
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\phi_2(u)"),
                          }}
                        />{" "}
                        are modified characteristic functions related to the
                        original{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\phi(u)"),
                          }}
                        />
                        . Specifically,
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\phi_2(u) = \\phi(u)"),
                          }}
                        />{" "}
                        and
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex(
                              "\\phi_1(u) = \\phi(u-i)/\\phi(-i)"
                            ),
                          }}
                        />
                        .
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Numerical Integration
                    </h3>
                    <p>
                      The integrals for P<sub>1</sub> and P<sub>2</sub> are
                      computed numerically. Our implementation:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Uses adaptive quadrature methods for accurate
                        integration
                      </li>
                      <li>
                        Truncates the infinite integration at an appropriate
                        upper limit (typically 100-200) where the integrand
                        becomes negligibly small
                      </li>
                      <li>
                        Adjusts the number of integration points based on option
                        characteristics (more points for short-dated options or
                        strikes far from current price)
                      </li>
                      <li>
                        Implements extensive caching mechanisms to avoid
                        recalculating the characteristic function multiple times
                        with the same parameters
                      </li>
                    </ul>

                    <p>
                      This semi-analytical approach is generally more efficient
                      than Monte Carlo simulation for standard European options
                      and provides greater accuracy, particularly when proper
                      numerical techniques are applied.
                    </p>
                  </div>
                </section>

                {/* Model Calibration */}
                <section id="calibration" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Model Calibration
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Calibration is the process of finding model parameters
                      that best fit observed market prices. For the Heston
                      model, this involves determining the optimal set &#123;κ,
                      θ, ξ, ρ, v<sub>0</sub>&#125; that minimizes the difference
                      between model-generated prices and market prices.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      The Calibration Problem
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <p className="mb-2 font-medium">Objective Function:</p>
                      <div
                        className="overflow-x-auto"
                        dangerouslySetInnerHTML={{
                          __html: renderLatexBlock(
                            `\\min_{\\kappa, \\theta, \\xi, \\rho, v_0} \\sum_{i=1}^n w_i\\left(P^{\\text{model}}_i(\\kappa, \\theta, \\xi, \\rho, v_0) - P^{\\text{market}}_i\\right)^2`
                          ),
                        }}
                      />

                      <p className="mt-3 text-sm">
                        Where w<sub>i</sub> are weights assigned to each option,
                        typically giving higher importance to more liquid
                        options or those closer to at-the-money.
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Calibration Strategy
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-lg my-4">
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          <strong>Data Preparation</strong>: Filter and clean
                          market data, removing illiquid options or those with
                          invalid prices.
                        </li>
                        <li>
                          <strong>Parameter Constraints</strong>: Define
                          reasonable bounds for each parameter:
                          <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
                            <li>κ (kappa): typically 0.1 to 10.0</li>
                            <li>
                              θ (theta): related to long-term implied
                              volatility, often 0.01 to 0.25
                            </li>
                            <li>
                              ξ (xi): volatility of volatility, typically 0.1 to
                              2.0
                            </li>
                            <li>
                              ρ (rho): correlation, typically -0.95 to 0.0
                            </li>
                            <li>
                              v<sub>0</sub>: initial variance, often close to
                              squared ATM implied volatility
                            </li>
                          </ul>
                        </li>
                        <li>
                          <strong>Multiple Initial Guesses</strong>: Start
                          optimization from several different parameter sets to
                          avoid getting trapped in local minima.
                        </li>
                        <li>
                          <strong>Optimization Algorithm</strong>: Use
                          gradient-based methods (e.g., L-BFGS-B) for
                          efficiency, with fallback to derivative-free methods
                          (e.g., Nelder-Mead) for robustness.
                        </li>
                        <li>
                          <strong>Weighting Scheme</strong>: Apply higher
                          weights to at-the-money options which are more liquid
                          and informative about the volatility structure.
                        </li>
                      </ol>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Implementation Optimizations
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Caching</strong>: Store and reuse intermediate
                        calculations to avoid redundant computations during the
                        optimizer's iterations.
                      </li>
                      <li>
                        <strong>Early Stopping</strong>: Reject poor parameter
                        sets quickly before full price computation.
                      </li>
                      <li>
                        <strong>Stratified Sampling</strong>: For large option
                        chains, use representative subsets during optimization
                        to improve speed.
                      </li>
                      <li>
                        <strong>Parallel Processing</strong>: Calculate model
                        prices for multiple options simultaneously.
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mb-3">
                      Calibration Quality Assessment
                    </h3>
                    <p>
                      We evaluate calibration quality using several metrics:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">
                          Root Mean Squared Error (RMSE)
                        </p>
                        <div
                          className="overflow-x-auto mt-1"
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              `\\text{RMSE} = \\sqrt{\\frac{1}{n}\\sum_{i=1}^n (P^{\\text{model}}_i - P^{\\text{market}}_i)^2}`
                            ),
                          }}
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">Mean Absolute Error (MAE)</p>
                        <div
                          className="overflow-x-auto mt-1"
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              `\\text{MAE} = \\frac{1}{n}\\sum_{i=1}^n |P^{\\text{model}}_i - P^{\\text{market}}_i|`
                            ),
                          }}
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">Mean Relative Error (MRE)</p>
                        <div
                          className="overflow-x-auto mt-1"
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              `\\text{MRE} = \\frac{1}{n}\\sum_{i=1}^n \\frac{|P^{\\text{model}}_i - P^{\\text{market}}_i|}{P^{\\text{market}}_i} \\times 100\\%`
                            ),
                          }}
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">Maximum Absolute Error</p>
                        <div
                          className="overflow-x-auto mt-1"
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              `\\text{MaxError} = \\max_i |P^{\\text{model}}_i - P^{\\text{market}}_i|`
                            ),
                          }}
                        />
                      </div>
                    </div>

                    <p>
                      A successful calibration typically achieves an RMSE below
                      1-2% of the underlying asset price, with particularly good
                      fits for options near the money.
                    </p>
                  </div>
                </section>

                {/* Further Resources */}
                <section id="resources" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Further Resources
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      For those interested in deepening their understanding of
                      option pricing theory and implementation:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="text-xl font-medium text-teal-600 mb-3">
                          Books
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            Hull, J. C. (2021).{" "}
                            <em>Options, Futures, and Other Derivatives</em>{" "}
                            (11th ed.). Pearson - The industry standard textbook
                            for derivatives pricing
                          </li>
                          <li>
                            Gatheral, J. (2006).{" "}
                            <em>
                              The Volatility Surface: A Practitioner's Guide
                            </em>
                            . Wiley - Excellent coverage of stochastic
                            volatility models
                          </li>
                          <li>
                            Wilmott, P. (2006).{" "}
                            <em>Paul Wilmott on Quantitative Finance</em>. Wiley
                            - Comprehensive with focus on computational methods
                          </li>
                          <li>
                            Lewis, A. L. (2000).{" "}
                            <em>
                              Option Valuation Under Stochastic Volatility
                            </em>
                            . Finance Press - Detailed coverage of Fourier
                            methods
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-medium text-teal-600 mb-3">
                          Research Papers
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            Black, F., & Scholes, M. (1973). The Pricing of
                            Options and Corporate Liabilities.
                            <em>Journal of Political Economy, 81(3)</em>
                          </li>
                          <li>
                            Heston, S. L. (1993). A Closed-Form Solution for
                            Options with Stochastic Volatility.
                            <em>Review of Financial Studies, 6(2)</em>
                          </li>
                          <li>
                            Gatheral, J., & Jacquier, A. (2014). Arbitrage-free
                            SVI volatility surfaces.
                            <em>Quantitative Finance, 14(1)</em>
                          </li>
                          <li>
                            Andersen, L. (2008). Simple and efficient simulation
                            of the Heston stochastic volatility model.
                            <em>Journal of Computational Finance, 11(3)</em>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-xl font-medium text-teal-600 mb-3">
                        Online Resources
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <a
                            href="https://en.wikipedia.org/wiki/Heston_model"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Wikipedia: Heston Model
                          </a>{" "}
                          - Comprehensive overview with mathematical details
                        </li>
                        <li>
                          <a
                            href="https://quantlib.org/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            QuantLib
                          </a>{" "}
                          - Open-source library for quantitative finance with
                          implementations of various option pricing models
                        </li>
                        <li>
                          <a
                            href="http://finance.bi.no/~bernt/gcc_prog/recipes/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Computational Finance recipes
                          </a>{" "}
                          - Practical numerical methods for finance by Bernt
                          Arne Ødegaard
                        </li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Navigation */}
                <section className="border-t border-gray-200 pt-6 mt-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">
                        Explore More
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Link
                          href="/documentation"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Documentation
                        </Link>
                        <span className="text-gray-400">•</span>
                        <a
                          href="https://github.com/hassanelq/Options-pricing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          GitHub Repository
                        </a>
                      </div>
                    </div>

                    <Link
                      href="/Options-pricing"
                      className="mt-4 md:mt-0 px-5 py-2 bg-gradient-to-r from-teal-600 to-emerald-500 text-white font-medium rounded-lg shadow hover:from-teal-700 hover:to-emerald-600 transition-all"
                    >
                      Try the Pricing Dashboard
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
