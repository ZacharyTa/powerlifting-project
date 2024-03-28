import Input from "@/components/Input";
import Button from "@/components/Button";
import Radio from "@/components/Radio";
import { ATTRIBUTES, SEX, UNIT } from "@/data/calculator/Calculations";
import { useState } from "react";
import toast from "react-hot-toast";
import { api } from "@/utils/api";

const Calculator = ({
  setPercentages,
  setPercentiles,
  setDivisions,
  setUnit,
}) => {
  const [input, setInput] = useState(ATTRIBUTES);

  const handleSubmit = async () => {
    if (!Object.values(input).every((value) => value)) {
      toast("❌ Please fill out everything.");
      return;
    }
    toast.loading("Please wait...");
    const { items, percentiles, divisions, status } = await api({
      url: `/api/compare?age=${input.age}&sex=${input.sex}&unit=${input.unit}&weight=${input.weight}&bench=${input.bench}&squat=${input.squat}&deadlift=${input.deadlift}`,
      method: "GET",
    });

    if (status !== 200) {
      toast("❌ Server Error, please try again later.");
      return;
    }
    toast.dismiss();
    toast("✅ Success!");
    setPercentiles(percentiles);
    setPercentages(items);
    setDivisions(divisions);
    setUnit(input.unit);
  };

  return (
    <div className="flex flex-col gap-y-7 items-center">
      <div className="flex flex-row gap-x-5">
        <Input name="age" maxLength={3} data={input} setData={setInput} />
        <Radio
          options={SEX}
          field="sex"
          current={input}
          setCurrent={setInput}
        />
      </div>
      <>
        <Radio
          options={UNIT}
          field="unit"
          current={input}
          setCurrent={setInput}
        />
        <Input
          name="weight"
          maxLength={3}
          data={input}
          isDecimal={true}
          setData={setInput}
        />
        <Input
          name="squat"
          maxLength={4}
          data={input}
          isDecimal={true}
          setData={setInput}
        />
        <Input
          name="bench"
          maxLength={4}
          data={input}
          isDecimal={true}
          setData={setInput}
        />
        <Input
          name="deadlift"
          maxLength={4}
          data={input}
          isDecimal={true}
          setData={setInput}
        />
      </>

      <Button name="Submit" onClick={handleSubmit} />
    </div>
  );
};
export default Calculator;
