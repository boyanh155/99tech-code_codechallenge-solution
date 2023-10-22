import { FormControl, InputLabel, Select } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useListPrice } from "../Context/ApiStateContext";
import { get, isEmpty, map } from "lodash";

const ListPrice = ({setValue,value}) => {
  const { data, loading, error, fetchData, isRetried } = useListPrice();



  const handleChangeMultiple = (event) => {

    const{options} = event.target
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        setValue(options[i].value)
      }
    }

  };
  return (
    <FormControl sx={{ m: 2, minWidth: 200, maxWidth: 200 }}>
      <InputLabel shrink htmlFor="select-multiple-native">
        Select currency
      </InputLabel>
      <Select
        multiple
        native
        value={[value]}
        // @ts-ignore Typings are not considering `native`
        onChange={handleChangeMultiple}
        label="Select currency"
        inputProps={{
          id: "select-multiple-native",
        }}
      >
        {map(data, (priceObj, index) => {
          return (
            <option
            style={{
              backgroundImage:`url(/assets/token-icon/${get(priceObj,'currency')}.svg)`,
              backgroundRepeat:'no-repeat',
              backgroundPosition:'left',
              backgroundSize:'contain',
              textIndent:'22px'
            }}
            key={index} value={index}>
           

              {get(priceObj, "currency", "reload")}
              </option>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default ListPrice;
