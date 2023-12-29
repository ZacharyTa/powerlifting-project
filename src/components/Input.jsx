const Input = ({ title, object, setObject, label }) => {
  return (
    <div className="flex items-center">
      {title}
      <input
        placeholder={title}
        type="number"
        pattern="[0-9]*"
        className="border-2 rounded-lg w-full font-poppins text-base py-1 bg-transparent px-2 ml-2"
        onChange={(e) => setObject({ ...object, [label]: e.target.value })}
      />
    </div>
  );
};

export default Input;
