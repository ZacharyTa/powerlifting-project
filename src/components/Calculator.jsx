"use client";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import { SEX } from "@/data/calculator/Calculations";
import { useState } from "react";
const Calculator = () => {
  const [current, setCurrent] = useState(null);

  return (
    <div className="flex flex-col gap-y-7 items-center">
      <div className="flex flex-row gap-x-5">
        <Input name="age" maxLength={3} />
        <Radio options={SEX} current={current} setCurrent={setCurrent} />
      </div>
      <Input name="weight(kg)" maxLength={4} />
      <Input name="squat(kg)" maxLength={4} />
      <Input name="bench(kg)" maxLength={4} />
      <Input name="deadlift(kg)" maxLength={4} />

      <Button name="Submit" />
    </div>
  );
};

export default Calculator;
