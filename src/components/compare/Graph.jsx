import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { randomNormal } from "d3-random";

const Graph = ({ size, percentagePercentile }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      console.log("percentagePercentile", percentagePercentile);
      d3.select(d3Container.current).selectAll("svg").remove();

      const svgModelUrl = "MalePowerlifter.svg"; // Local path for the SVG model

      // Generate a normal distribution for the X-axis placement
      const normal = randomNormal(size[0] / 2, 50);
      const liftersData = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: normal(),
        y: size[1] / 2,
      }));

      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("viewBox", `0 0 ${size[0]} ${size[1]}`)
        .append("g");

      const [min, max] = d3.extent(liftersData, (d) => d.x);

      // Define an offset
      const offset = 5;

      const x = d3
        .scaleLinear()
        .domain([min - offset, max + offset]) // Add offset to min and max
        .range([0, size[0]]);

      const userXPosition = x(
        d3.quantile(
          liftersData.map((d) => d.x).sort(d3.ascending),
          percentagePercentile / 100,
        ),
      );

      svg
        .append("line")
        .attr("x1", userXPosition)
        .attr("y1", 0)
        .attr("x2", userXPosition)
        .attr("y2", size[1])
        .attr("stroke", "black")
        .attr("stroke-width", 2);

      const simulation = d3
        .forceSimulation(liftersData)
        .force("x", d3.forceX((d) => x(d.x)).strength(0.1))
        .force("y", d3.forceY(size[1] / 2).strength(0.05))
        .force("collide", d3.forceCollide(10))
        .on("tick", ticked);

      function ticked() {
        // Select all lifter elements, bind them to the data, and handle the enter selection
        const lifters = svg
          .selectAll(".lifter")
          .data(liftersData, (d) => d.id) // Bind data to elements by id
          .join(
            (enter) =>
              enter
                .append("image") // Only append new elements on enter
                .attr("class", "lifter")
                .attr("xlink:href", svgModelUrl)
                .attr("width", 20)
                .attr("height", 20),
            (update) => update, // Update existing elements
            (exit) => exit.remove(), // Remove elements that no longer have data
          );

        // Now update the position of both new and existing elements
        lifters.attr("x", (d) => d.x - 10).attr("y", (d) => d.y - 10);
      }

      simulation.alpha(1).restart();
    }
  }, [size, percentagePercentile]);

  return <div ref={d3Container} />;
};

export default Graph;
