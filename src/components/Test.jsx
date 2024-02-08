"use client";
import React from "react";
import { useState } from "react";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { DIVISIONS } from "@/data/forms/Information";
import { UNITS } from "@/data/forms/Information";
const Test = () => {
  const [division, setDivision] = useState(null);
  const [unit, setUnit] = useState(null);
  const [data, setData] = useState(null);
  const [state, setState] = useState(false);
  return (
    <>
      <Input name="age" data={data} setData={setData} />
      <Input name="name" data={data} setData={setData} />
      <Select
        options={DIVISIONS}
        current={division}
        setCurrent={setDivision}
        title="Divisions"
      />
      <Button text="Compare" link="stats" />
      <Button text="Submit" state={state} setState={setState} />
    </>
  );
};

export default Test;
