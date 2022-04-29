import { configureStore } from '@reduxjs/toolkit'
import chatroomReducer from './chatroom'

export default configureStore({
  reducer: {
    chatroom: chatroomReducer,
  },
});
