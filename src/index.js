import tmi from 'tmi.js';
import React from 'react';
import ReactDOM from "react-dom/client";
import { Chatroom } from './convo';
import _ from 'underscore';

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const channel = params.channel;

const opts = {
  identity: {
    username: 'chopsoybot',
    password: params.oauth_token,
  },
  channels: [channel],
};

let client = new tmi.client(opts);

let allChatrooms = {};
let root = ReactDOM.createRoot(document.getElementById('app'));

function findChatroom(channel) {
  let chatroom = allChatrooms[channel];
  if (chatroom === undefined) {
    chatroom = newChatroom(channel);
    allChatrooms[channel] = chatroom;
  }
  return chatroom;
}

function newChatroom(channel) {
  return {channel: channel, conversations: []};
}

function now() {
  return Math.floor((new Date()).getTime() / 1000);
}

function newMessage(content) {
  return {content: content, timestamp: now()};
}

function newConversation(username, group, color) {
  return {
    username: username,
    group: group,
    messages: [],
    color: color,
  }
}

let saveState = _.throttle(() => {
  let localStorage = window.localStorage;
  localStorage.setItem('state', JSON.stringify(allChatrooms));
}, 1000);

function restoreState() {
  let localStorage = window.localStorage;
  let state = localStorage.getItem('state');
  if (state !== null) {
    allChatrooms = JSON.parse(state);
  }
}

function getGroup(context) {
  let badges = context.badges || {};
  if (badges.broadcaster === "1") {
    return "broadcaster";
  }
  if (context.mod === true || badges.moderator === "1") {
    return "mod";
  }
  if (badges.vip === "1") {
    return "vip";
  }
  return "everyone";
}

function storeMessage(chatroom, username, group, message, color) {
  let conversation = _.first(_.filter(chatroom.conversations, (conversation) =>
    conversation.username === username));
  let conversations;
  if (conversation === undefined) {
    conversation = newConversation(username, group, color);
    conversations = chatroom.conversations;
  } else {
    conversations = _.without(chatroom.conversations, conversation);
  }
  conversation.color = color;
  conversation.group = group;
  conversation.messages.push(newMessage(message));
  conversation.messages = _.last(conversation.messages, 20);
  conversations.push(conversation);
  conversations = _.last(conversations, 50);
  chatroom.conversations = conversations;
  saveState();
}

const bots = [
  'streamelements',
  'nightbot',
  'chopsoybot'
];

let click = new Audio('/click.wav');

function onMessageHandler(channel, context, message, self) {
  console.log(context);
  
  if (channel.startsWith("#")) {
    channel = channel.substr(1)
  }
  
  let username = context.username;
  let group = getGroup(context);
  let color = context.color;
  context.channel = channel
  
  let chatroom = findChatroom(channel)
  if (!_.contains(bots, username) && message[0] != '!') {
    storeMessage(chatroom, username, group, message, color);
  }
  
  // click.play();
  
  rerender();
}

let rerender = _.throttle(function () {
  let chatroom = findChatroom(channel);
  root.render(
   <Chatroom channel={chatroom.channel} conversations={chatroom.conversations} />
  );
}, 2000);

client.on("message", onMessageHandler);
client.connect();

restoreState();
rerender();
