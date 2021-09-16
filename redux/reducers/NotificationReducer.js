import { USER_NOTIFICATIONS_CHANGE } from "../constants";

const initialState = {
  currentNotifications: null,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_NOTIFICATIONS_CHANGE:
      return {
        ...state,
        currentNotifications: action.currentNotifications,
      };
    default:
     
      return state;
  }
};
