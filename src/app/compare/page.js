import Page from "@/components/compare/Page";
import Protected from "@/components/Protected";

const Compare = () => {
  return (
    <Protected>
      <Page
        id="start"
        title="Let's get started"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor increfidrefidunt ut labore "
      />
      <Page
        id="all"
        title="all"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor increfidrefidunt ut labore "
      />
      <Page
        id="weight"
        title="weight"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      />
      <Page
        id="age"
        title="age"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      />
      <Page
        id="end"
        title="end"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore "
      />
    </Protected>
  );
};

export default Compare;
