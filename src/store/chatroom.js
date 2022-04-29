import { createSlice } from '@reduxjs/toolkit'
import { now, trimLast } from '../utils'

export const chatroom = createSlice({
  name: 'chatroom',
  initialState: {
    conversations: {},
    conversationOrder: [],
  },
  reducers: {
    newMessage: (state, action) => {
      let {username, group, color, message} = action.payload;
      let conversation = state.conversations[username];
      if (conversation === undefined) {
        conversation = {username, group, color, messages: [], emotes: []}
      }
      conversation.messages.push({content: message, timestamp: now()})
      trimLast(conversation.messages, 10)
      state.conversations[username] = conversation
      // insert at the beginning
      let index = state.conversationOrder.indexOf(username)
      if (index !== -1) {
        state.conversationOrder.splice(index, 1)
      }
      state.conversationOrder.unshift(username)
      trimLast(state.conversationOrder, 20)
    },
    userEmote: (state, action) => {
      let {username, group, color, message} = action.payload;
      let conversation = state.conversations[username];
      if (conversation === undefined) {
        conversation = {username, group, color, messages: [], emotes: []}
      }
      conversation.emotes.push({content: message, timestamp: now()})
      trimLast(conversation.emotes, 10)
      state.conversations[username] = conversation
      // insert at the beginning
      let index = state.conversationOrder.indexOf(username)
      if (index !== -1) {
        state.conversationOrder.splice(index, 1)
      }
      state.conversationOrder.unshift(username)
      trimLast(state.conversationOrder, 20)
    }
  }
})

// Action creators are generated for each case reducer function
export const { newMessage, userEmote } = chatroom.actions

export default chatroom.reducer