"use client";
import { useRouter } from "next/navigation";

const Button = ({ name, link, state, setState }) => {
  const router = useRouter();

  return (
    <div
      className="bg-power-red-100 hover:bg-power-red-200 text-power-black text-2xl font-bold py-3 w-fit px-12 items-center rounded-2xl cursor-pointer h-fit duration-300"
      onClick={() => (link ? router.push(`/${link}`) : setState(!state))}
    >
      {name}
    </div>
  );
};

export default Button;
