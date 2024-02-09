import Navigation from "@/components/navigation/Navigation";

const Protected = ({ children, title }) => {
  return (
    <>
      <title>{title}</title>
      <Navigation />
      <div className="flex justify-center items-center">
        <div className={`w-full h-full`}>{children}</div>
      </div>
    </>
  );
};

export default Protected;
