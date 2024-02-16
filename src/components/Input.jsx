"use client";

const Input = ({ name, data, setData, maxLength }) => {
  return (
    <input
      className="bg-power-gray rounded-2xl p-4 placeholder:text-power-black/50 w-full"
      placeholder={name}
      pattern="[0-9]*"
      maxLength={maxLength}
      onChange={(e) => setData({ ...data, [name]: e.target.value })}
    />
  );
};

export default Input;
