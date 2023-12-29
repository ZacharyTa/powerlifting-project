"use client";
import React from "react";
import { useState } from "react";
import Toggle from "@/components/Toggle";
import Select from "@/components/Select";
import Input from "@/components/Input";
import { DIVISIONS } from "@/data/forms/Information";
import { UNITS } from "@/data/forms/Information";
const Test = () => {
  const [division, setDivision] = useState(null);
  const [unit, setUnit] = useState(null);
  return (
    <>
      <Toggle
        name="Units"
        color="white"
        text="LB"
        objects={UNITS}
        object={unit}
        setObject={setUnit}
      />
      <Select
        options={DIVISIONS}
        current={division}
        setCurrent={setDivision}
        title="Divisions"
      />
      <Input title="Age" />
    </>
  );
};

export default Test;
