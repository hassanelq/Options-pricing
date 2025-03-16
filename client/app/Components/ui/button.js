// components/ui/Button.js
import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { motion } from "framer-motion";

const Button = React.forwardRef(
  (
    {
      variant = "default",
      size = "default",
      className,
      children,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50";

    const variants = {
      default:
        "bg-gradient-to-r from-teal-600 to-emerald-500 text-white hover:from-teal-700 hover:to-emerald-600",
      destructive: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      secondary: "bg-gray-600 text-white hover:bg-gray-700",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
      link: "text-teal-600 underline hover:text-teal-700",
    };

    const sizes = {
      default: "h-10 px-4 text-sm",
      sm: "h-8 px-3 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10 text-sm",
    };

    return (
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.propTypes = {
  variant: PropTypes.oneOf([
    "default",
    "destructive",
    "outline",
    "secondary",
    "ghost",
    "link",
  ]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

Button.displayName = "Button";

export default Button;
