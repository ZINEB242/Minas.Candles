const occasions = [

    "Mariage",

    "Naissance",

    "Anniversaire",

    "Cadeau",

    "Pour moi"

];

const Step1 = ({ nextStep, formData, setFormData }) => {

    return (

        <div className="container py-5">

            <h2 className="text-center mb-5">

                Quelle est l'occasion ?

            </h2>

            <div className="row">

                {

                    occasions.map((item) => (

                        <div className="col-md-4 mb-4" key={item}>

                            <div

                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        occasion: item
                                    })
                                }

                                className={`card p-4 text-center ${formData.occasion === item ? "border border-3 border-danger" : ""
                                    }`}

                                style={{
                                    cursor: "pointer",
                                    borderRadius: "20px"
                                }}

                            >

                                <h4>{item}</h4>

                            </div>

                        </div>

                    ))

                }

            </div>

            <div className="text-center mt-4">

                <button

                    className="btn btn-dark"

                    disabled={!formData.occasion}

                    onClick={nextStep}

                >

                    Suivant

                </button>

            </div>

        </div>

    );

};

export default Step1;