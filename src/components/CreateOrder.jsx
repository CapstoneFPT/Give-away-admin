// CreateOrder.js
import React, { useState } from "react";
import { useCart } from "../services/context";
import Step1 from "../scenes/orders/Steps/Step1";
import Step2 from "../scenes/orders/Steps/Step2";
import Step3 from "../scenes/orders/Steps/Step3";

const CreateOrder = () => {
  const [step, setStep] = useState(1);
  const { clearCart } = useCart();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => {
    if (step === 1) {
      clearCart();
    }
    setStep((prev) => prev - 1);
  };

  return (
    <div>
      {step === 1 && <Step1 nextStep={nextStep} />}
      {step === 2 && <Step2 nextStep={nextStep} prevStep={prevStep} />}
      {step === 3 && <Step3 prevStep={prevStep} />}
    </div>
  );
};

export default CreateOrder;
