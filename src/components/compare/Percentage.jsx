const Percentage = ({ percent = "N/A", icon, description }) => {
  return (
    <div className="flex flex-row bg-power-gray h-1/3 p-5 rounded-xl justify-center items-center">
      {icon}
      <div className="flex flex-col mx-10 items-center text-center justify-center text-xl">
        Stronger than
        <div className="text-6xl">{percent}%</div>
        in your division.
      </div>
    </div>
  );
};

export default Percentage;
