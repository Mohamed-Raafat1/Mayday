import { combineReducers } from "redux";
import { chatList } from "./chatList";
import { user } from "./user";

const rootReducer = combineReducers({
  userState: user,
});

export default rootReducer;
