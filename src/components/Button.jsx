"use client";
import { COLORS } from "@/data/Button.js";

const Button = ({ text, color, onClick }) => {
  return (
    <button onClick={onClick}>
      <div
        className={`${COLORS[color].bg} ${COLORS[color].text} ${COLORS[color].hover} ${COLORS[color].border} border-2 border-b-6 rounded-2xl p-5 w-full`}
      >
        {text}
      </div>
    </button>
  );
};

export default Button;
