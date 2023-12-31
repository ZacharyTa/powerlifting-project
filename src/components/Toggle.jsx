"use client";

const Toggle = ({ name, objects, object, setObject }) => {
  return (
    <div className="flex items-center">
      {name}
      {objects.map((element, index) => {
        return element === object ? (
          <div
            className="bg-power-black/40 text-power-black border-2 rounded-2xl p-5 mx-2 cursor-pointer"
            key={index}
            onClick={() => setObject(element)}
          >
            {element}
          </div>
        ) : (
          <div
            className="bg-power-white text-power-black border-2 border-b-6 rounded-2xl p-5 mx-2 cursor-pointer"
            key={index}
            onClick={() => setObject(element)}
          >
            {element}
          </div>
        );
      })}
    </div>
  );
};

export default Toggle;
