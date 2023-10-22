import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useListPrice } from "./Context/ApiStateContext";
import InputGroup from "./components/InputGroup";
import { isEmpty, values } from "lodash";
import { useFormik } from "formik";
import * as Yup from "yup";

function App() {
  // API State
  const { error, loading, data, fetchData, isRetried } = useListPrice();
  const [leftInput, setLeftInput] = useState("1");

  //
  const [rightInput, setRightInput] = useState("1");
  const [rightPrice, setRightPrice] = useState(0);

  const validation = useFormik({
    initialValues: {
      leftPrice: "",
    },
    validationSchema: Yup.object().shape({
      leftPrice: Yup.number()
        .required("Enter input")
        .min(0, "Value greater than 0"),
    }),
  });

  // Fet value
  useEffect(() => {
    if (loading) return;
    if (isRetried > 3) {
      return;
      // error
    }
    if (error || isEmpty(data)) {
      fetchData();
    }
  }, [error, data, loading, isRetried, fetchData]);
  useEffect(() => {
    validation.validateForm();
  }, []);
  useEffect(() => {
    if (
      (isEmpty(leftInput) && isEmpty(rightInput)) ||
      isEmpty(data) ||
      validation.errors.leftPrice
    )
      return;
    const valueObjLeft = data[leftInput];
    const valueObjRight = data[rightInput];

    const equivalent1to2 =
      (valueObjRight.price / valueObjLeft.price) * validation.values.leftPrice;

    setRightPrice(equivalent1to2);
  }, [leftInput, validation.values.leftPrice, data, rightInput]);

  return (
    <>
      <Typography
        sx={{
          width: "100%",
          textAlign: "center",
        }}
        variant="h5"
      >
        Swap
      </Typography>
      {/* <Typography variant="caption">Change the input and select your currency, look at result</Typography> */}
      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
        {/* Show value */}
        {loading || isEmpty(data) ? (
          <CircularProgress />
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <>
            <Stack flexDirection="row">
              <InputGroup
                price={validation.values.leftPrice}
                setPrice={validation.handleChange}
                value={leftInput}
                setValue={setLeftInput}
                error={validation.errors.leftPrice}
              />
              <InputGroup
                type="right"
                price={rightPrice}
                setPrice={setRightPrice}
                value={rightInput}
                setValue={setRightInput}
              />
            </Stack>
            {/* List */}
          </>
        )}
      </div>
    </>
  );
}

export default App;
