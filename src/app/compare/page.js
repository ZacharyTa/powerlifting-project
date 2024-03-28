"use client";
import Protected from "@/components/Protected";
import Percentage from "@/components/compare/Percentage";
import Calculator from "@/components/Calculator";
import Graph from "@/components/compare/Graph";
import { IoMdPeople } from "react-icons/io";
import { useState } from "react";
import { SECTIONS } from "@/data/compare/Sections";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Section = ({ section, percentages, percentiles, unit, divisions }) => {
  const description = dynamicDescription(section.title, percentages);

  const variants = {
    hidden: { opacity: 0, y: -100 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
      },
    },
  };

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.95,
  });

  return (
    <motion.div
      ref={ref}
      id={section.title}
      className="grid grid-cols-5 items-center justify-items-end h-screen text-center"
      variants={variants}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
    >
      <div className="w-2/3 col-span-2 h-fit text-2xl text-left inline-block items-center">
        <div className="text-8xl font-bold mb-5 leading-snug">
          {section.title}
        </div>
        <div>{description}</div>
      </div>
      <motion.div className="flex flex-col col-span-2 gap-y-5">
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
      </motion.div>
    </motion.div>
  );
};

const dynamicDescription = (sectionTitle, percentages) => {
  if (["squat", "bench", "deadlift", "total"].includes(sectionTitle)) {
    const percentage = percentages[sectionTitle];
    return `Your ${sectionTitle} is higher than ${percentage}% of competitive powerlifters in your division!`;
  }
  // Fallback to the default description for sections that don't require a dynamic description
  return SECTIONS.find((section) => section.title === sectionTitle)
    ?.description;
};

const Compare = () => {
  const [percentages, setPercentages] = useState(null);
  const [percentiles, setPercentiles] = useState(null);
  const [divisions, setDivisions] = useState(null);
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
            Enter your stats into the calculator to see how you stack up against
            other USAPL powerlifters in your division!
          </div>
        </div>
        <div className="col-span-2">
          <Calculator
            setPercentages={setPercentages}
            setPercentiles={setPercentiles}
            setDivisions={setDivisions}
            setUnit={setUnit}
          />
        </div>
      </div>

      {percentages &&
        percentiles &&
        SECTIONS.map((section, index) => (
          <Section
            key={index}
            section={section}
            percentages={percentages}
            percentiles={percentiles}
            unit={unit}
          />
        ))}
    </Protected>
  );
};

export default Compare;
