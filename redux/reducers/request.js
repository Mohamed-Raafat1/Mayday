import { REQUEST_STATE_CHANGE } from "../constants";

const initialState = {
  currentRequest: null,
};

export const request = (state = initialState, action) => {
  switch (action.type) {
    case "a7a":
      return {
        ...state,
        currentRequest: action.currentRequest,
      };
    default:
      console.log(
        "im in default case________________________________________________"
      );
      return state;
  }
};
