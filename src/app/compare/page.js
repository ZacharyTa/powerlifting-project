"use client";
import Protected from "@/components/Protected";
import Percentage from "@/components/compare/Percentage";
import Calculator from "@/components/Calculator";
import Graph from "@/components/compare/Graph";
import { IoMdPeople } from "react-icons/io";
import { useState, useEffect, useRef } from "react";
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
  const firstSectionRef = useRef(null);

  useEffect(() => {
    if (percentages && percentiles && divisions && firstSectionRef.current) {
      firstSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [percentages, percentiles, divisions]);

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

      {percentages && percentiles && divisions && (
        <div
          ref={firstSectionRef}
          className="flex items-center justify-center h-screen text-4xl font-bold mb-5 text-gray-700 px-5"
        >
          {`If you were to compete, you would be in the ${divisions.weight} ${divisions.age} division...`}
        </div>
      )}

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

      {percentages && percentiles && divisions && (
        <div
          id="conclusion"
          className="flex flex-col items-center justify-center text-8xl font-bold"
        >
          conclusion
          <p className="text-2xl mt-4 text-center mx-auto max-w-screen-md">
            Remember that these numbers are comparing yourself to the powerhouse
            league of powerlifting! We're talking about—top-notch, seriously{" "}
            <u>
              <b>competitive</b>
            </u>{" "}
            folks. Now, if those numbers seem a bit intimidating, keep in mind,
            you're being compared to the best of the best. So if these numbers
            are lower than you hoped, don't get discouraged. Set your own
            records, Keep lifting, keep pushing, you can do more than you think.
            Remember, it's all about personal growth!
          </p>
        </div>
      )}
    </Protected>
  );
};

export default Compare;
