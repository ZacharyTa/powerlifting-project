import Button from "@/components/Button";

export default function Home() {
  return (
    <div className="grid grid-cols-5 h-screen w-screen text-center justify-items-end items-center">
      <div className="w-3/4 flex-col text-power-black items-center text-left col-span-3 text-4xl inline-block">
        <div className="text-8xl font-bold">Barbell Metrics</div>A power lifting
        analytics website!
      </div>
      <Button text="Get Started" link="dashboard" />
    </div>
  );
}
