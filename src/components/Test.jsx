"use client";
import React from "react";
import { useState } from "react";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { DIVISIONS } from "@/data/forms/Information.js";
const Test = () => {
  const [division, setDivision] = useState(null);
  return (
    <>
      <Button color="white" text="LB" />
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
