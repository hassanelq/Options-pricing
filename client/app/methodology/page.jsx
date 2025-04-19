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
  }, [latexLoaded, activeSection]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          content="Mathematical foundation of option pricing models"
        />
      </Head>

      {/* MathJax for rendering LaTeX */}
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
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
                  { id: "greeks", name: "The Greeks" },
                  { id: "heston-model", name: "Heston Model" },
                  { id: "ou-model", name: "Ornstein-Uhlenbeck Model" },
                  { id: "monte-carlo", name: "Monte Carlo Methods" },
                  { id: "fourier-methods", name: "Fourier Transform Methods" },
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
                  option pricing models implemented in the dashboard.
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
                      Option pricing theory provides a framework for determining
                      the fair value of financial derivatives. The fundamental
                      concept relies on the principle of no-arbitrage, which
                      states that in efficient markets, it should be impossible
                      to make risk-free profits above the risk-free rate.
                    </p>

                    <p>
                      The value of an option can be derived from the following
                      factors:
                    </p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>Current price of the underlying asset (S)</li>
                      <li>Strike price (K)</li>
                      <li>Time to expiration (T)</li>
                      <li>Risk-free interest rate (r)</li>
                      <li>Volatility of the underlying asset (σ)</li>
                      <li>Dividends (if applicable)</li>
                    </ul>

                    <p>Option payoffs at expiration are defined as:</p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        Call option payoff:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "\\text{Payoff}_{\\text{call}} = \\max(S_T - K, 0)"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Put option payoff:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "\\text{Payoff}_{\\text{put}} = \\max(K - S_T, 0)"
                            ),
                          }}
                        />
                      </p>
                    </div>

                    <p>
                      Where S<sub>T</sub> is the price of the underlying asset
                      at expiration time T.
                    </p>
                  </div>
                </section>

                {/* Black-Scholes Model */}
                <section id="black-scholes" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Black-Scholes Model
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The Black-Scholes model, developed by Fischer Black, Myron
                      Scholes, and Robert Merton in 1973, provides a theoretical
                      framework for pricing European-style options.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Key Assumptions
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        The underlying asset price follows a geometric Brownian
                        motion with constant drift and volatility
                      </li>
                      <li>Constant risk-free interest rate</li>
                      <li>No transaction costs or taxes</li>
                      <li>Markets operate continuously</li>
                      <li>No dividends during the option's life</li>
                      <li>No arbitrage opportunities</li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      The Model
                    </h3>
                    <p>
                      The Black-Scholes partial differential equation (PDE) that
                      governs option pricing is:
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0"
                            ),
                          }}
                        />
                      </p>
                    </div>

                    <p>
                      For European options, the Black-Scholes formula provides
                      closed-form solutions:
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        Call option price:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "C(S, t) = S \\cdot N(d_1) - K e^{-r(T-t)} \\cdot N(d_2)"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Put option price:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "P(S, t) = K e^{-r(T-t)} \\cdot N(-d_2) - S \\cdot N(-d_1)"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Where:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)(T-t)}{\\sigma\\sqrt{T-t}}"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "d_2 = d_1 - \\sigma\\sqrt{T-t}"
                            ),
                          }}
                        />
                      </p>
                    </div>

                    <p>
                      And N(x) is the cumulative distribution function of the
                      standard normal distribution.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Implementation
                    </h3>
                    <p>
                      In our implementation, we solve the Black-Scholes formula
                      both analytically (using the closed-form solution) and
                      numerically (using Monte Carlo simulation).
                    </p>
                  </div>
                </section>

                {/* The Greeks */}
                <section id="greeks" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    The Greeks
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The Greeks are measures of sensitivity of option prices to
                      changes in underlying parameters. They are essential for
                      risk management and hedging strategies.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-teal-600 mb-2">
                          Delta (Δ)
                        </h4>
                        <p className="mb-2">
                          Rate of change of option price with respect to the
                          underlying asset price.
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex(
                                  "\\Delta = \\frac{\\partial V}{\\partial S}"
                                ),
                              }}
                            />
                          </p>
                        </div>
                        <p className="mt-2 text-sm">
                          For Black-Scholes:
                          <br />
                          Call Delta:{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderLatex("\\Delta_{call} = N(d_1)"),
                            }}
                          />
                          <br />
                          Put Delta:{" "}
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderLatex("\\Delta_{put} = N(d_1) - 1"),
                            }}
                          />
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-teal-600 mb-2">
                          Gamma (Γ)
                        </h4>
                        <p className="mb-2">
                          Rate of change of Delta with respect to the underlying
                          asset price.
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex(
                                  "\\Gamma = \\frac{\\partial^2 V}{\\partial S^2}"
                                ),
                              }}
                            />
                          </p>
                        </div>
                        <p className="mt-2 text-sm">
                          For Black-Scholes:
                          <br />
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderLatex(
                                "\\Gamma = \\frac{N'(d_1)}{S\\sigma\\sqrt{T-t}}"
                              ),
                            }}
                          />
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-teal-600 mb-2">
                          Theta (Θ)
                        </h4>
                        <p className="mb-2">
                          Rate of change of option price with respect to time
                          (time decay).
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex(
                                  "\\Theta = \\frac{\\partial V}{\\partial t}"
                                ),
                              }}
                            />
                          </p>
                        </div>
                        <p className="mt-2 text-sm">
                          For call options:
                          <br />
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderLatex(
                                "\\Theta_{call} = -\\frac{S\\sigma N'(d_1)}{2\\sqrt{T-t}} - rKe^{-r(T-t)}N(d_2)"
                              ),
                            }}
                          />
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-teal-600 mb-2">
                          Vega
                        </h4>
                        <p className="mb-2">
                          Rate of change of option price with respect to
                          volatility.
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex(
                                  "\\text{Vega} = \\frac{\\partial V}{\\partial \\sigma}"
                                ),
                              }}
                            />
                          </p>
                        </div>
                        <p className="mt-2 text-sm">
                          For Black-Scholes:
                          <br />
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderLatex(
                                "\\text{Vega} = S\\sqrt{T-t}N'(d_1)"
                              ),
                            }}
                          />
                        </p>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                        <h4 className="text-lg font-medium text-teal-600 mb-2">
                          Rho (ρ)
                        </h4>
                        <p className="mb-2">
                          Rate of change of option price with respect to the
                          risk-free interest rate.
                        </p>
                        <div className="bg-gray-50 p-3 rounded">
                          <p>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: renderLatex(
                                  "\\rho = \\frac{\\partial V}{\\partial r}"
                                ),
                              }}
                            />
                          </p>
                        </div>
                        <p className="mt-2 text-sm">
                          For call options:
                          <br />
                          <span
                            dangerouslySetInnerHTML={{
                              __html: renderLatex(
                                "\\rho_{call} = K(T-t)e^{-r(T-t)}N(d_2)"
                              ),
                            }}
                          />
                        </p>
                      </div>
                    </div>
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
                      extends the Black-Scholes model by allowing for stochastic
                      volatility. It addresses the "volatility smile" observed
                      in options markets.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Model Dynamics
                    </h3>
                    <p>
                      The Heston model is defined by the following stochastic
                      differential equations (SDEs):
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        Asset price dynamics:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "dS_t = rS_t dt + \\sqrt{v_t}S_t dW^1_t"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Variance dynamics:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "dv_t = \\kappa(\\theta - v_t)dt + \\xi\\sqrt{v_t}dW^2_t"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        With correlation:{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "dW^1_t dW^2_t = \\rho dt"
                            ),
                          }}
                        />
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Model Parameters
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("v_0"),
                          }}
                        />
                        : Initial variance
                      </li>
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\kappa"),
                          }}
                        />
                        : Mean reversion rate of variance
                      </li>
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\theta"),
                          }}
                        />
                        : Long-term mean of variance
                      </li>
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\xi"),
                          }}
                        />
                        : Volatility of variance (vol of vol)
                      </li>
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\rho"),
                          }}
                        />
                        : Correlation between asset returns and variance
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Solution Methods
                    </h3>
                    <p>
                      There is no simple closed-form solution for the Heston
                      model like there is for Black-Scholes. Instead, we
                      implement:
                    </p>

                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        <strong>Fourier transform-based methods:</strong> Using
                        the characteristic function approach via the Carr-Madan
                        formulation.
                      </li>
                      <li>
                        <strong>Monte Carlo simulation:</strong> Using
                        Euler-Maruyama discretization with full truncation to
                        handle the square root process.
                      </li>
                    </ol>

                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <h4 className="font-medium mb-2">
                        Characteristic Function
                      </h4>
                      <p>
                        The semi-analytical pricing involves the characteristic
                        function of the log-price:
                      </p>
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "\\phi(u, T, S, v) = \\mathbb{E}\\left[e^{iu\\ln(S_T)}\\right] = e^{C(u,T) + D(u,T)v + iu\\ln(S)}"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Where C and D are complex functions of the model
                        parameters.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Ornstein-Uhlenbeck Model */}
                <section id="ou-model" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Ornstein-Uhlenbeck Model
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      The Ornstein-Uhlenbeck (OU) process is a stochastic
                      process that describes the velocity of a particle under
                      friction. In finance, it's used to model mean-reverting
                      processes like interest rates or commodity prices.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Model Dynamics
                    </h3>
                    <p>
                      The OU process is defined by the stochastic differential
                      equation:
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "dX_t = \\kappa(\\theta - X_t)dt + \\xi dW_t"
                            ),
                          }}
                        />
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Model Parameters
                    </h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\kappa"),
                          }}
                        />
                        : Mean reversion rate
                      </li>
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\theta"),
                          }}
                        />
                        : Long-term mean level
                      </li>
                      <li>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\xi"),
                          }}
                        />
                        : Volatility parameter
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Application to Options
                    </h3>
                    <p>
                      For option pricing on assets following an OU process, we
                      use:
                    </p>

                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Monte Carlo simulation to generate price paths</li>
                      <li>Analytical approximations when available</li>
                    </ol>

                    <p>The expectation and variance of the OU process are:</p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "\\mathbb{E}[X_t|X_0] = X_0 e^{-\\kappa t} + \\theta(1 - e^{-\\kappa t})"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "\\text{Var}[X_t|X_0] = \\frac{\\xi^2}{2\\kappa}(1 - e^{-2\\kappa t})"
                            ),
                          }}
                        />
                      </p>
                    </div>
                  </div>
                </section>

                {/* Monte Carlo Methods */}
                <section id="monte-carlo" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Monte Carlo Methods
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Monte Carlo simulation is a numerical method that uses
                      repeated random sampling to obtain numerical results. In
                      option pricing, we simulate many possible price paths to
                      estimate the expected payoff.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      General Procedure
                    </h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Generate a large number of random price paths for the
                        underlying asset
                      </li>
                      <li>Calculate the option payoff for each path</li>
                      <li>Take the average of these payoffs</li>
                      <li>Discount the average payoff back to present value</li>
                    </ol>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Euler-Maruyama Discretization
                    </h3>
                    <p>
                      For the Black-Scholes model, the Euler discretization is:
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "S_{t+\\Delta t} = S_t + rS_t\\Delta t + \\sigma S_t \\sqrt{\\Delta t} Z"
                            ),
                          }}
                        />
                      </p>
                      <p>Where Z is a standard normal random variable.</p>
                    </div>

                    <p>For the Heston model, we use:</p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "S_{t+\\Delta t} = S_t + rS_t\\Delta t + \\sqrt{v_t} S_t \\sqrt{\\Delta t} Z_1"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "v_{t+\\Delta t} = v_t + \\kappa(\\theta - v_t)\\Delta t + \\xi\\sqrt{v_t} \\sqrt{\\Delta t} Z_2"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "Z_1 = \\rho Z_2 + \\sqrt{1-\\rho^2}Z_3"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Where Z<sub>2</sub> and Z<sub>3</sub> are independent
                        standard normal random variables.
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Variance Reduction Techniques
                    </h3>
                    <p>
                      To improve the efficiency of Monte Carlo simulation, we
                      implement:
                    </p>

                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Antithetic variates:</strong> For each random
                        path, we generate its antithetic counterpart by flipping
                        the sign of the random numbers.
                      </li>
                      <li>
                        <strong>Control variates:</strong> Use analytical
                        solutions (when available) to reduce the variance of the
                        Monte Carlo estimator.
                      </li>
                    </ul>
                  </div>
                </section>

                {/* Fourier Methods */}
                <section id="fourier-methods" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Fourier Transform Methods
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      Fourier transform methods provide efficient techniques for
                      option pricing when the characteristic function of the
                      log-price is known analytically, as in the case of the
                      Heston model.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Carr-Madan Formula
                    </h3>
                    <p>
                      The Carr-Madan approach allows us to express option prices
                      in terms of the Fourier transform:
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "C(S, K, T) = \\frac{e^{-\\alpha \\ln(K)}}{\\pi} \\int_0^{\\infty} e^{-iv\\ln(K)} \\frac{\\psi_T(v-i(\\alpha+1))}{\\alpha^2 + \\alpha - v^2 + i(2\\alpha+1)v} dv"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Where{" "}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatex("\\psi_T"),
                          }}
                        />{" "}
                        is the characteristic function of the log-price process.
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Fast Fourier Transform Implementation
                    </h3>
                    <p>
                      For computational efficiency, we use the FFT algorithm:
                    </p>

                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Choose a suitable damping factor α to ensure
                        integrability
                      </li>
                      <li>Discretize the integral using an N-point grid</li>
                      <li>Apply the FFT algorithm</li>
                      <li>Extract option prices for a range of strikes</li>
                    </ol>

                    <p>
                      This approach is highly efficient, allowing option prices
                      to be computed for multiple strikes simultaneously.
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
                      Model calibration is the process of finding model
                      parameters that best fit observed market prices. This is
                      particularly important for models like Heston, where
                      parameters cannot be directly observed.
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Objective Function
                    </h3>
                    <p>
                      We minimize the difference between model prices and market
                      prices:
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg my-4 overflow-x-auto">
                      <p>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: renderLatexBlock(
                              "\\min_{\\theta} \\sum_{i=1}^n w_i \\left(C_{\\text{model}}(K_i; \\theta) - C_{\\text{market}}(K_i)\\right)^2"
                            ),
                          }}
                        />
                      </p>
                      <p>
                        Where θ represents the model parameters to be
                        calibrated, and w<sub>i</sub> are weights (often related
                        to trading volume or bid-ask spread).
                      </p>
                    </div>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Optimization Methods
                    </h3>
                    <p>We implement two optimization approaches:</p>

                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Levenberg-Marquardt:</strong> A damped
                        least-squares method that combines Gauss-Newton and
                        gradient descent. Efficient for least-squares problems.
                      </li>
                      <li>
                        <strong>Trust Region Reflective:</strong> A constrained
                        optimization method that respects parameter boundaries,
                        important for ensuring meaningful parameters.
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Calibration Metrics
                    </h3>
                    <p>To evaluate calibration quality, we report:</p>

                    <ul className="list-disc pl-5 space-y-1">
                      <li>Root Mean Squared Error (RMSE)</li>
                      <li>Mean Absolute Error (MAE)</li>
                      <li>Mean Relative Error (%)</li>
                      <li>Maximum Error</li>
                    </ul>

                    <div className="bg-gray-50 p-4 rounded-lg my-4">
                      <p>
                        For the Heston model, a good calibration typically
                        requires:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Data across different strikes (to capture the
                          volatility smile)
                        </li>
                        <li>
                          Multiple maturities (to capture the term structure)
                        </li>
                        <li>Reasonable initial parameter guesses</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Further Resources */}
                <section id="resources" className="scroll-mt-24">
                  <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                    Further Resources
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <p>
                      For readers interested in deepening their understanding of
                      option pricing, we recommend:
                    </p>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Books
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Hull, J. C. (2017).{" "}
                        <em>Options, Futures, and Other Derivatives</em>.
                        Pearson.
                      </li>
                      <li>
                        Wilmott, P. (2006).{" "}
                        <em>Paul Wilmott on Quantitative Finance</em>. Wiley.
                      </li>
                      <li>
                        Gatheral, J. (2006).{" "}
                        <em>The Volatility Surface: A Practitioner's Guide</em>.
                        Wiley.
                      </li>
                      <li>
                        Shreve, S. E. (2004).{" "}
                        <em>
                          Stochastic Calculus for Finance II: Continuous-Time
                          Models
                        </em>
                        . Springer.
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Research Papers
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        Black, F., & Scholes, M. (1973). The Pricing of Options
                        and Corporate Liabilities.{" "}
                        <em>Journal of Political Economy, 81(3)</em>, 637-654.
                      </li>
                      <li>
                        Heston, S. L. (1993). A Closed-Form Solution for Options
                        with Stochastic Volatility with Applications to Bond and
                        Currency Options.{" "}
                        <em>The Review of Financial Studies, 6(2)</em>, 327-343.
                      </li>
                      <li>
                        Carr, P., & Madan, D. (1999). Option Valuation Using the
                        Fast Fourier Transform.{" "}
                        <em>Journal of Computational Finance, 2(4)</em>, 61-73.
                      </li>
                    </ul>

                    <h3 className="text-xl font-medium text-teal-600 mt-6 mb-3">
                      Online Resources
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <a
                          href="https://github.com/hassanelq/Simulations-MC-BrownMotion"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          GitHub Repository for this project
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.quantstart.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          QuantStart: Quantitative Finance Tutorials
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.wilmott.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Wilmott: Quantitative Finance Community
                        </a>
                      </li>
                    </ul>
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
                          href="https://github.com/hassanelq/Simulations-MC-BrownMotion"
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
