"use client";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import { SEX } from "@/data/calculator/Calculations";
import { useState } from "react";
const Calculator = () => {
  const [current, setCurrent] = useState(null);
  const [data, setData] = useState({
    age: '',
    current: '',
    weight: '',
    squat: '',
    bench: '',
    deadlift: '',
  });


  const handleSubmit = async () => {
    const response = await fetch(`/api/comparePercents?age=${data.age}&sex=${"0"}&weight=${data.weight}&bench=${data.bench}&squat=${data.squat}&deadlift=${data.deadlift}`, {
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
      <Input name="weight" maxLength={4} data={data} setData={setData} />
      <Input name="squat(kg)" maxLength={4} data={data} setData={setData} />
      <Input name="bench(kg)" maxLength={4} data={data} setData={setData} />
      <Input name="deadlift(kg)" maxLength={4} data={data} setData={setData} />

      <Button name="Submit" onClick={handleSubmit}/>
    </div>
  );
};

export default Calculator;
