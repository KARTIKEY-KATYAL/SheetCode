"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";

const circleVariants: Variants = {
  inactive: {
    cx: 8,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  active: {
    cx: 16,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

interface ToggleLeftProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
  isActive?: boolean;
}

const ToggleLeft = ({
  width = 28,
  height = 28,
  strokeWidth = 2,
  stroke = "#ffffff",
  isActive = false,
  ...props
}: ToggleLeftProps) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start(isActive ? "active" : "inactive");
  }, [isActive, controls]);

  return (
    <div
      style={{
        cursor: "pointer",
        userSelect: "none",
        padding: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <rect 
          width="20" 
          height="12" 
          x="2" 
          y="6" 
          rx="6" 
          ry="6" 
          fill={isActive ? "#16a34a" : "#d1d5db"}
        />
        <motion.circle
          cy="12"
          r="2"
          fill="#ffffff"
          variants={circleVariants}
          animate={controls}
          initial={isActive ? "active" : "inactive"}
        />
      </svg>
    </div>
  );
};

export { ToggleLeft };
