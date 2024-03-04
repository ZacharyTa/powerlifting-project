const Page = ({ title, id, description, right }) => {
  return (
    <div
      id={id}
      className="grid grid-cols-5 items-center justify-items-end h-screen text-center"
    >
      <div className="w-2/3 col-span-2 h-fit text-2xl text-left inline-block items-center">
        <div className="text-8xl font-bold mb-5 leading-snug">{title}</div>
        <div>{description}</div>
      </div>
      <div className="col-span-2">{right}</div>
    </div>
  );
};

export default Page;
