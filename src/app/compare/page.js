"use client";
import Page from "@/components/compare/Page";
import Protected from "@/components/Protected";
import Percentage from "@/components/compare/Percentage";
import Calculator from "@/components/Calculator";
import Loading from "@/components/Loading";
import { Bs6Square } from "react-icons/bs";
import { useState } from "react";

const Compare = () => {
  const [percentages, setPercentages] = useState({});
  const [page, setPage] = useState(0);

  return (
    <Protected>
      {page === 0 && (
        <Page
          id="start"
          title="Let's get started"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor increfidrefidunt ut labore "
          right={
            <Calculator setPercentages={setPercentages} setPage={setPage} />
          }
        />
      )}
      {page === 1 && <Loading />}
      {page === 2 && (
        <>
          <Page
            id="squat"
            title="squat"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor increfidrefidunt ut labore "
            right={
              <Percentage
                percent={percentages.percentStrongerSquat}
                icon={<Bs6Square className="text-6xl" />}
                description="Lorem ipsume quia dolor sit amet"
              />
            }
          />
          <Page
            id="bench"
            title="bench"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
            right={
              <Percentage
                percent={percentages.percentStrongerBench}
                icon={<Bs6Square className="text-6xl" />}
                description="Lorem ipsume quia dolor sit amet"
              />
            }
          />
          <Page
            id="deadlift"
            title="deadlift"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
            right={
              <Percentage
                percent={percentages.percentStrongerDeadlift}
                icon={<Bs6Square className="text-6xl" />}
                description="Lorem ipsume quia dolor sit amet"
              />
            }
          />
          <Page
            id="total"
            title="total"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
            right={
              <Percentage
                percent={percentages.percentStrongerTotal}
                icon={<Bs6Square className="text-6xl" />}
                description="Lorem ipsume quia dolor sit amet"
              />
            }
          />
          <Page
            id="conclusion"
            title="conclusion"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
          />
        </>
      )}
    </Protected>
  );
};

export default Compare;
