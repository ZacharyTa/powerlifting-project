"use client";
import React from "react";
import { useState } from "react";
import Toggle from "@/components/Toggle";
import Select from "@/components/Select";
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
    </>
  );
};

export default Test;
