# Options Pricing

A comprehensive tool for calculating and analyzing options prices using various mathematical models.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Models Implemented](#models-implemented)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project provides a suite of tools for pricing financial options contracts. It implements several mathematical models to calculate theoretical prices and risk metrics for options trading and analysis.

## Features

- Price calculation for European and American options
- Support for multiple pricing models (Black-Scholes, Binomial, Monte Carlo)
- Greeks calculation (Delta, Gamma, Theta, Vega, Rho)
- Implied volatility calculation
- Visualization tools for options strategies
- Batch processing for multiple options

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/options-pricing.git
cd options-pricing

# Install dependencies
pip install -r requirements.txt
```

## Usage

```python
# Example usage for Black-Scholes model
from models.black_scholes import BlackScholes

# Initialize with option parameters
option = BlackScholes(
    spot_price=100,
    strike_price=105,
    time_to_expiry=0.5,  # in years
    risk_free_rate=0.05,
    volatility=0.2,
    option_type="call"
)

# Calculate option price
price = option.calculate_price()
print(f"Option price: {price}")

# Calculate Greeks
delta = option.calculate_delta()
gamma = option.calculate_gamma()
print(f"Delta: {delta}, Gamma: {gamma}")
```

## Models Implemented

- **Black-Scholes Model**: For European options without dividends
- **Merton Model**: Extension of Black-Scholes with dividends
- **Binomial Tree Model**: For American and European options
- **Monte Carlo Simulation**: For complex path-dependent options

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
