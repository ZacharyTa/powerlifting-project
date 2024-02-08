"use client";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Select = ({ options, current, setCurrent, title }) => {
  const [show, setShow] = useState(false);
  return (
    <Dropdown onToggle={() => setShow(!show)}>
      <Dropdown.Toggle className="bg-power-gray !rounded-xl text-power-black/50 p-4 !w-full text-left text-lg flex items-center justify-between">
        {!current && title}
        {current && <div className="text-power-black">{current}</div>}
        <MdOutlineKeyboardArrowDown
          className={`${show && "rotate-180"} text-3xl`}
        />
      </Dropdown.Toggle>
      {show && (
        <Dropdown.Menu className="!bg-power-gray !rounded-xl !p-1 !w-full">
          {options &&
            options.map((option, index) => (
              <Dropdown.Item
                key={index}
                className="flex hover:bg-power-gray py-3 px-4"
                onClick={() => setCurrent(option)}
              >
                {option}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
};

export default Select;
