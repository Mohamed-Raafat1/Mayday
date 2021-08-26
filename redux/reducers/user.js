import {
  USER_MESSAGES_UPDATE,
  USER_STATE_CHANGE,
  USER_MESSAGES_CHANGE,
  USER_CHATLIST_CHANGE,
  EMERGENCY_CONTACTS_CHANGE,
} from "../constants";


const initialState = {
  currentUser: null,
  conversations: [],
  messages: [],
  medicalID: [],
  emergencyContacts : [],
};

export const user = (state = initialState, action) => {
  switch (action.type) {
    case USER_STATE_CHANGE:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    case USER_CHATLIST_CHANGE:
      return {
        ...state,
        conversations: action.conversations,
      };
    case USER_MESSAGES_CHANGE:
      return {
        ...state,
        messages: action.messages,
      };
    case USER_MESSAGES_UPDATE: 
      return {
        ...state,
      };
      // case EMERGENCY_CONTACTS_CHANGE: 
      // return {
      //   ...state,
      //   emergencyContacts: action.emergencyContacts,
      // };
   
    default:
      return { state };
  }
};
