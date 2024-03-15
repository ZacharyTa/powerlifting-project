import { ImSpinner2 } from "react-icons/im";

const Loading = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center text-6xl">
      LOADING
      <ImSpinner2 className="animate-spin mt-5" />
    </div>
  );
};

export default Loading;
