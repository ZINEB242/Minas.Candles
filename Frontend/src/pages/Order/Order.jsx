import { useState } from "react";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Summary from "./Summary";

const Order = () => {

    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({

        occasion: "",

        fragrance: "",

        color: "",

        message: "",

        firstName: "",

        lastName: "",

        phone: "",

        wilaya: "",

        commune: "",

        address: ""

    });

    const nextStep = () => setStep(step + 1);

    const prevStep = () => setStep(step - 1);

    switch (step) {

        case 1:
            return (
                <Step1
                    nextStep={nextStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            );

        case 2:
            return (
                <Step2
                    nextStep={nextStep}
                    prevStep={prevStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            );

        case 3:
            return (
                <Step3
                    nextStep={nextStep}
                    prevStep={prevStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            );

        case 4:
            return (
                <Step4
                    nextStep={nextStep}
                    prevStep={prevStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            );

        case 5:
            return (
                <Step5
                    nextStep={nextStep}
                    prevStep={prevStep}
                    formData={formData}
                    setFormData={setFormData}
                />
            );

        default:
            return <Summary formData={formData} />;
    }

};

export default Order;