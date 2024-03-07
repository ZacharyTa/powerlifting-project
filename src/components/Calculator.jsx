"use client";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import { ATTRIBUTES, SEX } from "@/data/calculator/Calculations";
import { useState } from "react";

const Calculator = () => {
  const [current, setCurrent] = useState(SEX);
  const [data, setData] = useState(ATTRIBUTES);


  const handleSubmit = async () => {
    const response = await fetch(`/api/comparePercents?age=${data.age}&sex=${current}&weight=${data.weight}&bench=${data.bench}&squat=${data.squat}&deadlift=${data.deadlift}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    console.log(responseData);
  };

  return (
    <div className="flex flex-col gap-y-7 items-center">
      <div className="flex flex-row gap-x-5">
        <Input name="age" maxLength={3} data={data} setData={setData} />
        <Radio options={SEX} current={current} setCurrent={setCurrent} />
      </div>
      <>
        <Input name="weight" maxLength={4} data={data} setData={setData} />
        <Input name="squat" maxLength={4} data={data} setData={setData} />
        <Input name="bench" maxLength={4} data={data} setData={setData} />
        <Input name="deadlift" maxLength={4} data={data} setData={setData} />
      </>

      <Button name="Submit" onClick={handleSubmit}/>
    </div>
  );
};

export default Calculator;
