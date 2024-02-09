"use client";
import { useRouter } from "next/navigation";

const Button = ({ text, link, state, setState }) => {
  const router = useRouter();

  return (
    <div
      className="bg-power-red-100 hover:bg-power-red-200 text-power-black text-3xl font-bold py-5 w-fit px-10 items-center rounded-2xl cursor-pointer h-fit"
      onClick={() => (link ? router.push(`/${link}`) : setState(!state))}
    >
      {text}
    </div>
  );
};

export default Button;
