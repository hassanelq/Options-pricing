"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("getting-started");

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
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
            <h2 className="text-xl font-bold text-teal-800 mb-4">Contents</h2>
            <nav className="space-y-1">
              {[
                { id: "getting-started", name: "Getting Started" },
                { id: "model-overview", name: "Model Overview" },
                { id: "parameters", name: "Parameter Guide" },
                { id: "market-data", name: "Market Data" },
                { id: "solution-methods", name: "Solution Methods" },
                { id: "api-reference", name: "API Reference" },
                { id: "troubleshooting", name: "Troubleshooting" },
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
                href="/Options-pricing"
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Go to Pricing Dashboard
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
                Options Pricing Documentation
              </h1>
              <p className="text-gray-600">
                Comprehensive guide to using the Options Pricing Dashboard and
                understanding its features.
              </p>
            </div>

            <div className="space-y-12">
              {/* Getting Started Section */}
              <section id="getting-started" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                  Getting Started
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    The Options Pricing Dashboard allows you to price options
                    using various models and methodologies. This guide will help
                    you navigate the application and understand how to use its
                    features effectively.
                  </p>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-medium text-blue-800 mb-2">
                      Basic Workflow
                    </h3>
                    <ol className="list-decimal ml-5 text-gray-700 space-y-2">
                      <li>Select an option style (European)</li>
                      <li>Choose a pricing model (Black-Scholes or Heston)</li>
                      <li>Select the underlying asset type</li>
                      <li>Enter the symbol to fetch market data (optional)</li>
                      <li>Input or auto-fill option parameters</li>
                      <li>Choose a solution method</li>
                      <li>
                        Click "Calculate Option Price" or "Compare Methods"
                      </li>
                    </ol>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Interface Overview
                    </h3>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <p className="text-gray-500 italic mb-2">
                        Interface screenshot would go here
                      </p>
                      <div className="inline-block bg-white px-3 py-1 rounded border border-gray-300 text-sm">
                        The dashboard with various input sections and result
                        display
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Configuration Area
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Contains all the inputs needed to specify your option
                          pricing problem, organized in expandable sections.
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Results Area
                        </h4>
                        <p className="text-gray-600 text-sm">
                          Displays the calculated option price, Greeks, and
                          performance metrics. Also includes visual payoff
                          diagrams.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Model Overview Section */}
              <section id="model-overview" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                  Model Overview
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    The application supports the following pricing models, each
                    with its own characteristics and applicable scenarios:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-2 px-4 border-b text-left text-gray-700">
                            Model
                          </th>
                          <th className="py-2 px-4 border-b text-left text-gray-700">
                            Key Features
                          </th>
                          <th className="py-2 px-4 border-b text-left text-gray-700">
                            Best For
                          </th>
                          <th className="py-2 px-4 border-b text-left text-gray-700">
                            Limitations
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 px-4 border-b font-medium">
                            Black-Scholes
                          </td>
                          <td className="py-3 px-4 border-b">
                            <ul className="list-disc ml-4 text-sm">
                              <li>Assumes constant volatility</li>
                              <li>
                                Underlying follows Geometric Brownian Motion
                              </li>
                              <li>Provides a closed-form solution</li>
                              <li>Industry standard benchmark</li>
                            </ul>
                          </td>
                          <td className="py-3 px-4 border-b text-sm">
                            European vanilla options on non-dividend or
                            continuously-dividend paying stocks
                          </td>
                          <td className="py-3 px-4 border-b text-sm">
                            Cannot capture volatility smiles or skews; assumes
                            constant interest rates and volatility.
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 border-b font-medium">
                            Heston (1993)
                          </td>
                          <td className="py-3 px-4 border-b">
                            <ul className="list-disc ml-4 text-sm">
                              <li>Models volatility as a stochastic process</li>
                              <li>
                                Variance follows a mean-reverting process (CIR)
                              </li>
                              <li>
                                Allows correlation between asset and variance
                              </li>
                              <li>
                                Semi-closed form solution via Characteristic
                                Functions
                              </li>
                            </ul>
                          </td>
                          <td className="py-3 px-4 border-b text-sm">
                            Capturing volatility smiles/skews and term
                            structures; pricing options where volatility
                            dynamics are important.
                          </td>
                          <td className="py-3 px-4 border-b text-sm">
                            More complex; requires calibration of 5 parameters;
                            computationally more intensive than Black-Scholes.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4">
                    <p className="text-gray-700">
                      For a more detailed mathematical treatment of each model,
                      visit our
                      <Link
                        href="/methodology"
                        className="text-blue-600 hover:text-blue-800 mx-1"
                      >
                        Methodology page
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </section>

              {/* Parameter Guide Section */}
              <section id="parameters" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                  Parameter Guide
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Understanding the input parameters is crucial for accurate
                    option pricing. Here's a guide to each parameter and its
                    interpretation:
                  </p>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-800">
                        Common Parameters
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Underlying Price (S)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            The current market price of the underlying asset.
                            For stocks, this is the current stock price.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Strike Price (K)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            The price at which the option holder can buy (call)
                            or sell (put) the underlying asset.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Time to Expiration (T)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            The time remaining until the option expires,
                            measured in years. For example, 3 months would be
                            0.25 years.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Risk-Free Rate (r)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            The annualized interest rate for a risk-free
                            investment over the option's lifetime. Often based
                            on treasury yields.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Volatility (σ or Implied Volatility)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            For Black-Scholes: A measure of the underlying
                            asset's price variability (annualized standard
                            deviation). For Heston: Used as the initial variance
                            `v0 = σ²` if `v0` is not provided directly. Can be
                            historical or implied from market prices.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Dividend Yield (q or div)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            The annualized continuous dividend yield of the
                            underlying asset. Enter 0 if the asset pays no
                            dividends.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Option Type
                          </div>
                          <div className="col-span-2 text-gray-700">
                            Call (right to buy) or Put (right to sell) the
                            underlying asset.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-800">
                        Heston Model Parameters
                      </h3>
                    </div>
                    <div className="p-4">
                      <ul className="space-y-3">
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Initial Variance (v0)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            The starting value for the variance process at time
                            t=0. Often initialized as the square of the current
                            implied volatility (`σ²`). Must be positive.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Mean Reversion Speed (κ - kappa)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            Rate at which the variance `v(t)` reverts towards
                            the long-term mean `θ`. Higher `κ` means faster
                            reversion. Must be positive.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Long-term Variance (θ - theta)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            The long-term average level that the variance
                            process tends toward. Must be positive.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Volatility of Volatility (ξ - xi or volvol)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            Measures the volatility of the variance process
                            itself. Higher `ξ` means variance changes more
                            rapidly. Must be positive.
                          </div>
                        </li>
                        <li className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div className="font-medium text-gray-800">
                            Correlation (ρ - rho)
                          </div>
                          <div className="col-span-2 text-gray-700">
                            Correlation between the asset's returns (`dW^1_t`)
                            and its variance process (`dW^2_t`). Typically
                            negative for equities (leverage effect). Must be
                            between -1 and 1.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Market Data Section */}
              <section id="market-data" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                  Market Data
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    The application can fetch real-time market data for options
                    to assist in your analysis. Here's how to use this feature:
                  </p>

                  <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                    <h3 className="text-lg font-medium text-emerald-800 mb-2">
                      Using Market Data
                    </h3>
                    <ol className="list-decimal ml-5 text-gray-700 space-y-2">
                      <li>
                        Enter a valid stock symbol (e.g., AAPL, MSFT, GOOGL)
                      </li>
                      <li>Click "Fetch Market Data"</li>
                      <li>
                        A table of available options contracts will appear
                      </li>
                      <li>
                        Click "Auto-Fill" on any contract to use its parameters
                      </li>
                    </ol>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Data Sources
                    </h3>
                    <p className="text-gray-700">
                      Our application connects to market data APIs to fetch
                      current option prices and implied volatilities. This
                      provides a realistic starting point for your analysis or
                      model calibration.
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Available Data
                        </h4>
                        <ul className="list-disc ml-4 text-gray-700 text-sm space-y-1">
                          <li>Stock price</li>
                          <li>Option strike prices</li>
                          <li>Expiration dates</li>
                          <li>Current premiums</li>
                          <li>Implied volatilities</li>
                          <li>Volume information</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-2">
                          Limitations
                        </h4>
                        <ul className="list-disc ml-4 text-gray-700 text-sm space-y-1">
                          <li>Data may be delayed by 15-20 minutes</li>
                          <li>Not all assets have options data available</li>
                          <li>API rate limits may apply</li>
                          <li>Accuracy dependent on data provider</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Solution Methods Section */}
              <section id="solution-methods" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                  Solution Methods
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Each pricing model offers different solution methods with
                    varying trade-offs between accuracy, speed, and flexibility.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-teal-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Closed-Form Solution
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Analytical formulas providing exact answers (within
                        model assumptions).
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          Extremely fast computation
                        </li>
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          Highly accurate (no numerical errors)
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Limited to specific models and option types
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Monte Carlo Simulation
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Simulates thousands of random price paths for the
                        underlying asset and its variance (for Heston) to
                        estimate the option value.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          Versatile: Works with complex models like Heston.
                        </li>
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          Can handle complex payoff structures
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Computationally intensive and slower
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Subject to simulation error
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mb-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-purple-700"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Characteristic Function (Fourier Transform)
                      </h3>
                      <p className="text-gray-700 mb-3">
                        Uses the model's characteristic function and numerical
                        integration (often via FFT) to find the option price.
                        Primary method for Heston.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          Efficient and accurate for models like Heston.
                        </li>
                        <li className="flex items-start">
                          <span className="text-teal-500 mr-2">✓</span>
                          Often faster than Monte Carlo for standard options.
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Requires the characteristic function to be known.
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-500 mr-2">✗</span>
                          Numerical integration needs careful implementation.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* API Reference Section */}
              <section id="api-reference" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                  API Reference
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    For developers, the application provides several API
                    endpoints that can be used programmatically.
                  </p>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-800">
                        Option Pricing Endpoint
                      </h3>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        POST /api/v1/price
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Calculate the price of an option given the specified
                        parameters.
                      </p>
                      <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm mb-4">
                        <pre>
                          {`// Request
{
  "symbol": "AAPL",          // Optional: For context, not used in calculation
  "model_type": "heston",    // "blackScholes", "heston"
  "solution_type": "fourier",// "closedForm" (BS), "monteCarlo" (Heston), "fourier" (Heston)
  "option_type": "call",     // "call" or "put"
  "underlying_price": 175.0,
  "strike_price": 180.0,
  "yearsToExpiration": 0.25,
  "risk_free_rate": 0.05,
  "volatility": 0.25,        // Required for BS, used for v0 in Heston if v0 absent
  "dividend_yield": 0.01,    // Continuous dividend yield (use 0 if none)

  // --- Heston Specific (Required if model_type="heston") ---
  "kappa": 2.0,              // Mean reversion speed
  "theta": 0.0625,           // Long-term variance (0.25^2)
  "xi": 0.3,                 // Volatility of variance (volvol)
  "rho": -0.7,               // Correlation
  "v0": 0.0625,              // Initial variance (optional, defaults to volatility^2)

  // --- Monte Carlo Specific (Required if solution_type="monteCarlo") ---
  "monte_carlo_simulations": 10000, // Number of paths
  "n_steps": 100             // Number of time steps in simulation
}`}
                        </pre>
                      </div>

                      <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
                        <pre>
                          {`// Response (Example for Heston Fourier)
{
  "price": 7.85,
  "methodology": "Heston Characteristic Function (Heston 1993)",
  "calculation_time": 15.3, // milliseconds
  // Greeks might be included depending on calculation method
  "delta": 0.55,
  "gamma": 0.015,
  "theta": -0.04,
  "vega": 0.28, // Note: Vega in Heston is complex, this might be simplified
  "rho": 0.45
  // Monte Carlo response would include "stderr"
}`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-800">
                        Market Data Endpoint
                      </h3>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        GET /api/v1/market-data/{"{symbol}"}
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Fetch available options contracts for a given symbol.
                      </p>
                      <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
                        <pre>
                          {`// Response
[
  {
    "symbol": "AAPL",
    "option_type": "call",
    "strike_price": 180,
    "expiration": "2023-12-15",
    "stock_price": 175.5,
    "market_price": 8.35,
    "implied_volatility": 0.25,
    "volume": 1250
  },
  // More option contracts...
]`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h3 className="text-lg font-medium text-gray-800">
                        Calibration Endpoint
                      </h3>
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">
                        POST /api/v1/calibrate
                      </h4>
                      <p className="text-gray-700 mb-3">
                        Calibrate Heston model parameters to market option
                        prices for a specific symbol and expiration date.
                      </p>
                      <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm mb-4">
                        <pre>
                          {`// Request
{
  "symbol": "AAPL",            // Ticker symbol
  "expiration": "2023-12-15",  // Expiration date (YYYY-MM-DD)
  "underlying_price": 175.5,   // Current underlying price
  "risk_free_rate": 0.05,      // Annualized risk-free rate
  "dividend_yield": 0.01       // Optional: Annualized dividend yield (default 0)
}`}
                        </pre>
                      </div>

                      <div className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
                        <pre>
                          {`// Response (Success Example)
{
  "success": true,
  "kappa": 1.85,
  "theta": 0.058,
  "volvol": 0.32, // xi (Volatility of Variance)
  "rho": -0.68,
  "var0": 0.061,  // Initial Variance
  "div": 0.01,    // Dividend yield used
  "calibration_metrics": {
    "MSE": 0.00025,
    "RMSE": 0.0158,
    "MAE": 0.0115,
    "max_abs_error": 0.045,
    "mean_rel_error_pct": 3.2,
    "median_rel_error_pct": 2.5,
    "n_options_used": 45,
    "original_n_options": 120,
    "optimizer_iterations": 85,
    "calibration_time_seconds": 25.6
  },
  "market_data_used": [ // Array of market data points used in calibration
    { "strike": 170, "mid_price": 10.5, "maturity": 0.25, ... },
    ...
  ]
}

// Response (Failure Example)
{
  "success": false,
  "error": "No valid market data available for calibration",
  "error_details": "Traceback...", // Optional traceback
  "kappa": 0.0,
  "theta": 0.0,
  "volvol": 0.0,
  "rho": 0.0,
  "var0": 0.0,
  "div": 0.01,
  "calibration_time_seconds": 1.2
}`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Troubleshooting Section */}
              <section id="troubleshooting" className="scroll-mt-24">
                <h2 className="text-2xl font-semibold text-teal-700 mb-4">
                  Troubleshooting
                </h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    If you encounter issues while using the options pricing
                    dashboard, here are some common problems and their
                    solutions:
                  </p>

                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <dl>
                      <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 bg-gray-50">
                        <dt className="text-sm font-medium text-gray-800">
                          Market data not loading
                        </dt>
                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                          <ul className="list-disc ml-4 space-y-1">
                            <li>
                              Check that you entered a valid ticker symbol
                            </li>
                            <li>Verify your internet connection</li>
                            <li>The symbol may not have options available</li>
                            <li>
                              API rate limits may have been reached - try again
                              later
                            </li>
                          </ul>
                        </dd>
                      </div>
                      <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                        <dt className="text-sm font-medium text-gray-800">
                          Unexpected pricing results
                        </dt>
                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                          <ul className="list-disc ml-4 space-y-1">
                            <li>Double-check your input parameters</li>
                            <li>
                              Ensure volatility is entered as a percentage
                              (e.g., 20 for 20%)
                            </li>
                            <li>Verify the time to expiration is in years</li>
                            <li>
                              For near-zero time to expiration, use intrinsic
                              value
                            </li>
                          </ul>
                        </dd>
                      </div>
                      <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200 bg-gray-50">
                        <dt className="text-sm font-medium text-gray-800">
                          Heston calibration fails or gives poor results
                        </dt>
                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                          <ul className="list-disc ml-4 space-y-1">
                            <li>
                              Ensure sufficient liquid market data (bid/ask
                              spreads, volume) across various strikes and the
                              specific expiration. Calibration needs rich data.
                            </li>
                            <li>
                              Market data quality is crucial. Outliers or stale
                              prices can heavily skew results.
                            </li>
                            <li>
                              The optimizer might get stuck in local minima. The
                              backend tries multiple initial guesses, but
                              complex market conditions can still be
                              challenging.
                            </li>
                            <li>
                              Check the reported calibration metrics (RMSE,
                              MAE). High errors indicate a poor fit.
                            </li>
                            <li>
                              Consider if the Heston model is appropriate for
                              the current market regime.
                            </li>
                            <li>
                              Calibration is time-limited; complex scenarios
                              might require more time than allocated.
                            </li>
                          </ul>
                        </dd>
                      </div>
                      <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-b border-gray-200">
                        <dt className="text-sm font-medium text-gray-800">
                          Monte Carlo simulation is slow
                        </dt>
                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                          <ul className="list-disc ml-4 space-y-1">
                            <li>
                              Reduce the number of simulations for faster
                              results
                            </li>
                            <li>
                              More simulations increase accuracy but take longer
                            </li>
                            <li>
                              Consider using closed-form solutions when
                              available
                            </li>
                            <li>
                              Complex models like Heston take longer to simulate
                            </li>
                          </ul>
                        </dd>
                      </div>
                      <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                        <dt className="text-sm font-medium text-gray-800">
                          Parameter constraints
                        </dt>
                        <dd className="mt-1 text-sm text-gray-600 sm:mt-0 sm:col-span-2">
                          <ul className="list-disc ml-4 space-y-1">
                            <li>Volatility (`σ`) must be positive.</li>
                            <li>Time to expiration (`T`) must be positive.</li>
                            <li>Strike price (`K`) must be positive.</li>
                            <li>
                              For Heston: `kappa (κ)`, `theta (θ)`, `xi (ξ)`,
                              and `v0` must be positive.
                            </li>
                            <li>
                              For Heston: `rho (ρ)` must be between -1 and 1
                              (typically -0.99 to 0 for calibration stability).
                            </li>
                            <li>
                              The Feller condition (`2κθ &lt; ξ²`) ensures
                              variance stays positive, though it's not strictly
                              enforced in all pricing implementations. Violating
                              it can sometimes lead to instability.
                            </li>
                          </ul>
                        </dd>
                      </div>
                    </dl>
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
                        href="/methodology"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Methodology
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
  );
}
