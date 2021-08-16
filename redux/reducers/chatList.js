import { USER_CHAT_CHANGE } from "../constants";

const initialState = {
  currentChatList: null,
};
export const chatList = (state = initialState, action) => {
  return {
    ...state,
    currentChatList: action.currentchatList,
  };
};
