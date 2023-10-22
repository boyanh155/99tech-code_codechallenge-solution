import React from "react";
import ListPrice from "./ListPrice";
import {
  FormControl,
  FormHelperText,
  Input,
  InputAdornment,
  InputLabel,
  Stack,
} from "@mui/material";
import { get } from "lodash";
import { useListPrice } from "../Context/ApiStateContext";

const InputGroup = ({ setValue, value, price, setPrice, type, error }) => {
  const { data } = useListPrice();
  const currentItem = data?.[value];

  return (
    <Stack>
      <FormControl variant="filled">
        <InputLabel>
          {type === "right" ? "Result" : "Input"}({currentItem.currency})
        </InputLabel>
        <Input
          // value={get(value,'currency',null)}
          error={error}
          name={type === "right" ? "rightPrice" : "leftPrice"}
      
          disabled={type === "right"}
          value={price}
          onChange={setPrice}
          // endAdornment={
          //   <InputAdornment position="end">{`Price:${currentItem.price}`}</InputAdornment>
          // }
          aria-describedby="left-box-input"
          inputProps={{
            "aria-label": "weight",
          }}
        />
        <FormHelperText error={error}>
          {error ? error : `Price:${currentItem.price}`}
        </FormHelperText>
      </FormControl>
      <ListPrice setValue={setValue} value={value} />
    </Stack>
  );
};

export default InputGroup;
