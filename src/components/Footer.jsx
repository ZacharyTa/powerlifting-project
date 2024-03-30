import Link from "next/link";
import { SiGithub } from "react-icons/si";

const Footer = () => {
  return (
    <div className="w-full flex bg-power-gray h-1/6 items-center justify-between px-10">
      <div className="text-5xl font-bold">Barbell Metrics</div>
      <Link
        className="text-5xl hover:scale-110 duration-300"
        href="https://github.com/ZacharyTa/powerlifting-project"
      >
        <SiGithub />
      </Link>
    </div>
  );
};

export default Footer;
