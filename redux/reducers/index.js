import { combineReducers } from "redux";
import { chatList } from "./chatList";
import { user } from "./user";
import { request } from "./request";
import { notificationReducer } from "./NotificationReducer";

const rootReducer = combineReducers({
  userState: user,
  requestState: request,
  notificationState: notificationReducer,
});

export default rootReducer;
