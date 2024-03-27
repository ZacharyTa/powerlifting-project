import Image from "next/image";
import Button from "@/components/Button";
// import compare from "@/public/compare.webp";

const Card = ({ title, description, img }) => {
  return (
    <div className="flex bg-power-gray w-full p-5 rounded-xl">
      <Image src={img} width={200} height={200} className="rounded-xl" />
      <div className="flex flex-col text-5xl ml-5 gap-y-3">
        <div className="font-bold">{title}</div>
        <div className="text-xl">{description}</div>
        <Button name="Dive in" link="compare" />
      </div>
    </div>
  );
};

export default Card;
