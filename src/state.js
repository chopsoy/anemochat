import _ from 'underscore';
import { Chatroom } from './model/chatroom';

let allChatrooms = {};
window.allChatrooms = allChatrooms;

function restoreState(channel) {
  let localStorage = window.localStorage;
  let state = localStorage.getItem(`state_${channel}`);
  if (state !== null) {
    allChatrooms[channel] = Chatroom.restore(JSON.parse(state));
  }
}

let saveState = _.throttle((channel) => {
  let localStorage = window.localStorage;
  let chatroom = findChatroom(channel);
  localStorage.setItem(`state_${channel}`, JSON.stringify(chatroom));
}, 60 * 1000);

function findChatroom(channel) {
  let chatroom = allChatrooms[channel];
  if (chatroom === undefined) {
    chatroom = new Chatroom(channel);
    allChatrooms[channel] = chatroom;
  }
  return chatroom;
}

export { allChatrooms, saveState, restoreState, findChatroom };
