import Page from "@/components/compare/Page";
import Protected from "@/components/Protected";
import Percentage from "@/components/compare/Percentage";
import Calculator from "@/components/Calculator";
import { Bs6Square } from "react-icons/bs";
import { api } from "@/utils/api";

const Compare = () => {
  api({
    command: "SELECT * FROM lifts_table WHERE age < ? LIMIT 10;",
    values: [20],
  }).then((response) => console.log(response));
  return (
    <Protected>
      <Page
        id="start"
        title="Let's get started"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor increfidrefidunt ut labore "
        right={<Calculator />}
      />
      <Page
        id="squat"
        title="squat"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor increfidrefidunt ut labore "
        right={
          <Percentage
            percent={60}
            icon={<Bs6Square className="text-6xl" />}
            description="Lorem ipsume quia dolor sit amet"
          />
        }
      />
      <Page
        id="bench"
        title="bench"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      />
      <Page
        id="deadlift"
        title="deadlift"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      />
      <Page
        id="total"
        title="total"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      />
      <Page
        id="conclusion"
        title="conclusion"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      />
    </Protected>
  );
};

export default Compare;
