"use client";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const Select = ({ options, current, setCurrent, title }) => {
  const [show, setShow] = useState(false);
  return (
    <Dropdown onToggle={() => setShow(!show)}>
      <Dropdown.Toggle className="!border-2 !border-b-6 hover:bg-power-gray !rounded-xl p-2 w-1/3 text-left text-lg flex items-center justify-between">
        {!current && title}
        {current && current}
        <FaCaretDown />
      </Dropdown.Toggle>
      {show && (
        <Dropdown.Menu className="!border-2 !rounded-xl w-1/3 py-2 text-lg">
          {options &&
            options.map((option, index) => (
              <Dropdown.Item
                key={index}
                className="flex hover:bg-power-gray p-2"
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
