"use client";
import { useRouter } from "next/navigation";

const Button = ({ text, link, state, setState }) => {
  const router = useRouter();

  return (
    <div
      className="bg-power-red-100 text-power-black text-xl font-bold py-5 w-fit px-10 items-center rounded-2xl cursor-pointer"
      onClick={() => (link ? router.push(`/${link}`) : setState(!state))}
    >
      {text}
    </div>
  );
};

export default Button;
