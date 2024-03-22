import * as d3 from "d3";
import { useEffect, useRef } from "react";

const Graph = ({ size, percentagePercentile, percentilesData }) => {
  const d3Container = useRef(null);

  useEffect(() => {
    if (d3Container.current) {
      //console.log("percentagePercentile", percentagePercentile);
      console.log("percentilesData", percentilesData);
      d3.select(d3Container.current).selectAll("svg").remove();

      const svgModelUrl = "MalePowerlifter.svg"; // Local path for the SVG model

      const liftersData = percentilesData
        ? percentilesData.map((data, i) => ({
            id: i,
            x: size[0], // Offset data points to the right initially
            y: size[1] / 2,
            lift_value: +data.lift_value, // Convert lift_value to number
            percentile_rank: data.percentile_rank,
          }))
        : [];

      // Create a tooltip
      const tooltip = d3
        .select(d3Container.current)
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "#fff")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px");

      const svg = d3
        .select(d3Container.current)
        .append("svg")
        .attr("viewBox", `0 0 ${size[0]} ${size[1]}`)
        .append("g");

      const percentile1 = percentilesData
        ? percentilesData.find((d) => d.percentile_rank === 1).lift_value
        : null;
      const percentile99 = percentilesData
        ? percentilesData.find((d) => d.percentile_rank === 99).lift_value
        : null;

      const x = d3
        .scaleLinear()
        .domain([percentile1 - 10, percentile99 + 10]) // Use the 1st and 99th percentiles as the domain
        .range([0, size[0]]);

      const userXPosition = x(
        d3.quantile(
          liftersData.map((d) => d.lift_value).sort(d3.ascending),
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
        .force("x", d3.forceX((d) => x(d.lift_value)).strength(0.1)) // Push the points towards their lift_value
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
                .attr("height", 20)
                // Add mouseover and mouseout events for the tooltip
                .on("mouseover", function (event, d) {
                  tooltip
                    .style("visibility", "visible")
                    .text(
                      `Percentile:${d.percentile_rank}, Lifts: ${d.lift_value}`,
                    );
                })
                .on("mousemove", function (event) {
                  tooltip
                    .style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 10 + "px");
                })
                .on("mouseout", function () {
                  tooltip.style("visibility", "hidden");
                }),
            (update) => update, // Update existing elements
            (exit) => exit.remove(), // Remove elements that no longer have data
          );

        // Now update the position of both new and existing elements
        lifters.attr("x", (d) => d.x - 10).attr("y", (d) => d.y - 10);
      }

      simulation.alpha(1).restart();
    }
  }, [size, percentagePercentile, percentilesData]);

  return <div ref={d3Container} />;
};

export default Graph;
