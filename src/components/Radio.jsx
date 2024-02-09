const Radio = ({ options, current, setCurrent }) => {
  return (
    <div className="grid grid-cols-2 w-full">
      {options.map((option, index) => (
        <div
          className="flex items-center whitespace-nowrap hover:cursor-pointer"
          key={index}
          onClick={() => setCurrent(option)}
        >
          <div className="rounded-full w-5 border-black border aspect-square bg-transparent p-0.5 mr-1">
            <div
              className={`rounded-full w-full aspect-square duration-100 ${
                current === option ? "bg-power-red-100" : "bg-transparent"
              }`}
            />
          </div>
          {option}
        </div>
      ))}
    </div>
  );
};

export default Radio;
