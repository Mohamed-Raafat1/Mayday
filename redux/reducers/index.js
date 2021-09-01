import { combineReducers } from "redux";
import { chatList } from "./chatList";
import { user } from "./user";
import {request} from './request'

const rootReducer = combineReducers({
  userState: user,
  requestState: request,
});

export default rootReducer;
