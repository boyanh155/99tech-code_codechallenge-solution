import axios from "axios";
import { createContext, useContext, useReducer } from "react";

const initialState = {
  error: null,
  data: null,
  loading: false,
  isRetried:0,
};
const ApiStateContext = createContext(initialState);

// Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_PENDING":
      return {
        ...state,
        loading: true,
        error: null,
        isRetried: state.isRetried + 1,
      };
    case "FETCH_FULLFIL":
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case "FETCH_REJECT":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Create a provider component
export const ApiStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Define a function to fetch the data
  const fetchData = () => {
    dispatch({ type: "FETCH_PENDING" });

    axios
      .get("https://interview.switcheo.com/prices.json")
      .then((res) => {
        dispatch({ type: "FETCH_FULLFIL", payload: res.data });
      })
      .catch((err) => {
        console.log(err)
        dispatch({ type: "FETCH_REJECT", payload: err });
      });
  };

  return (
    <ApiStateContext.Provider
      value={{
        data: state.data,
        loading: state.loading,
        error: state.error,
        fetchData:fetchData,
        
      }}
    >
      {children}
    </ApiStateContext.Provider>
  );
};

// Select
export const useListPrice = () => {
  const context = useContext(ApiStateContext);
  if (!context) {
    throw new Error("useListPrice must be used within a ListPriceProvider");
  }
  return context;
};
