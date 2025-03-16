// components/ui/NavLink.js
import Link from "next/link";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const NavLink = ({
  children,
  href,
  variant = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all";
  const variants = {
    default: "px-6 py-2.5 text-gray-600 hover:text-teal-600",
    gradient:
      "text-white bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-700 hover:to-emerald-600 px-6 py-3 shadow-md hover:shadow-lg",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5",
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </Link>
    </motion.div>
  );
};

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["default", "gradient", "outline"]),
  className: PropTypes.string,
};

export default NavLink;
