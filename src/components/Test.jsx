"use client";
import React from "react";
import { useState } from "react";
import Select from "@/components/Select";
import Input from "@/components/Input";
import { DIVISIONS } from "@/data/forms/Information";
import { UNITS } from "@/data/forms/Information";
const Test = () => {
  const [division, setDivision] = useState(null);
  const [unit, setUnit] = useState(null);
  const [data, setData] = useState(null);
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
    </>
  );
};

export default Test;
