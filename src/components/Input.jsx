"use client";

const Input = ({ name, data, setData, maxLength, isDecimal, tooltip }) => {
  const decimalPart = isDecimal ? `(\\.\\d{0,2})?` : "";
  const newMaxLength = isDecimal ? maxLength + 3 : maxLength;
  const regex = new RegExp(`^\\d{0,${maxLength}}${decimalPart}$`);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === "" || regex.test(value)) {
      setData({ ...data, [name]: value });
    }
  };

  return (
    <input
      className="bg-power-gray rounded-2xl p-4 placeholder:text-power-black/50 w-full"
      placeholder={name}
      maxLength={newMaxLength}
      title={tooltip}
      onChange={handleInputChange}
      value={data[name]}
    />
  );
};

export default Input;
