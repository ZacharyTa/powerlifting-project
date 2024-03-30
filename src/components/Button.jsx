"use client";
import { useRouter } from "next/navigation";

const Button = ({ name, link, onClick, disabled }) => {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) {
      return;
    }
    if (link) {
      router.push(`/${link}`);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`button ${
        disabled ? "disabled" : ""
      } text-2xl font-bold py-3 w-fit px-12 items-center rounded-2xl h-fit duration-300 ${
        disabled
          ? "bg-power-gray text-power-black cursor-not-allowed"
          : "bg-power-red-100 hover:bg-power-red-200 text-power-black cursor-pointer"
      }`}
      onClick={handleClick}
    >
      {name}
    </div>
  );
};

export default Button;
