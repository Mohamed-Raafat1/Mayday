import { REQUEST_STATE_CHANGE } from "../constants";

const initialState = {
  currentRequest: null,
};

export const request = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_STATE_CHANGE:
      return {
        ...state,
        currentRequest: action.currentRequest,
      };
    default:
      return state;
  }
};
