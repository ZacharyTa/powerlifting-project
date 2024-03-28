"use client";
import Protected from "@/components/Protected";
import Percentage from "@/components/compare/Percentage";
import Calculator from "@/components/Calculator";
import Graph from "@/components/compare/Graph";
import { IoMdPeople } from "react-icons/io";
import { useState } from "react";
import { SECTIONS } from "@/data/compare/Sections";

const Compare = () => {
  const [percentages, setPercentages] = useState(null);
  const [percentiles, setPercentiles] = useState(null);
  const [unit, setUnit] = useState({});

  return (
    <Protected>
      <div
        id="start"
        className="grid grid-cols-5 items-center justify-items-end h-screen text-center"
      >
        <div className="w-2/3 col-span-2 h-fit text-2xl text-left inline-block items-center">
          <div className="text-8xl font-bold mb-5 leading-snug">start</div>
          <div>
            Enter your weight information into the calculator to see how you
            stack up against other weightlifting competitors in your category!
          </div>
        </div>
        <div className="col-span-2">
          <Calculator
            setPercentages={setPercentages}
            setPercentiles={setPercentiles}
            setUnit={setUnit}
          />
        </div>
      </div>

      {percentages &&
        percentiles &&
        SECTIONS.map((section, index) => (
          <div
            key={index}
            id={section.title}
            className="grid grid-cols-5 items-center justify-items-end h-screen text-center"
          >
            <div className="w-2/3 col-span-2 h-fit text-2xl text-left inline-block items-center">
              <div className="text-8xl font-bold mb-5 leading-snug">
                {section.title}
              </div>
              <div>{section.description}</div>
            </div>
            <div className="flex flex-col col-span-2 gap-y-5">
              <Graph
                size={[450, 300]}
                percentagePercentile={percentages[section.title]}
                percentilesData={percentiles[section.title]}
                unit={unit}
              />
              <Percentage
                percent={percentages[section.title]}
                icon={<IoMdPeople className="text-6xl" />}
                description="Lorem ipsume quia dolor sit amet"
              />
            </div>
          </div>
        ))}

      {percentages && percentiles && (
        <div
          id="conclusion"
          className="flex flex-col items-center justify-center text-8xl font-bold"
        >
          conclusion
        </div>
      )}
    </Protected>
  );
};

export default Compare;
