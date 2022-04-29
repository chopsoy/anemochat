import tmi from 'tmi.js'
import React from 'react'
import ReactDOM from "react-dom/client"
import _ from 'underscore'

import { Chatroom } from './view/chatroom'
import { saveState, restoreState, findChatroom } from './state'
import { trimLast, getGroup } from './utils'

import store from './store/store'
import { Provider } from 'react-redux'
import { Counter } from './store/counter'

import { useDispatch } from 'react-redux'
import { newMessage, userEmote } from './store/chatroom'

import { buildEmoteLookupDict, getTwitchEmoteUrl, storeEmote, isEmote } from './emotes'

const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
})

const channel = params.channel

const opts = {
  identity: {
    username: 'chopsoybot',
    password: params.oauth_token,
  },
  channels: [channel],
}

let client = new tmi.client(opts)

let root = ReactDOM.createRoot(document.getElementById('app'))

const BOT_USERNAMES = [
  'streamelements',
  'nightbot',
  'chopsoybot'
]

function storeMessage(chatroom, username, group, message, color) {
  chatroom.addMessage(username, group, color, message)
  saveState()
}

function registerEmotes(message, emotes) {
  _.each(emotes, (emote, emoteId) => {
    let [begin, end] = emote[0].split('-')
    let emoteName = message.substring(parseInt(begin), parseInt(end) + 1)
    storeEmote(emoteName, {
      name: emoteName,
      url: getTwitchEmoteUrl(emoteId)
    })
  })
}

function onMessageHandler(channel, context, message, self) {
  // console.log(context)
  
  if (channel.startsWith("#")) {
    channel = channel.substr(1)
  }
  
  let username = context.username
  let group = getGroup(context)
  let color = context.color
  
  if (context.emotes !== null) {
    registerEmotes(message, context.emotes)
  }
  
  let chatroom = findChatroom(channel)
  if (_.contains(BOT_USERNAMES, username) || message[0] === '!') {
    return
  }
  
  if (isEmote(message)) {
    store.dispatch(userEmote({username, group, color, message}))
  } else {
    store.dispatch(newMessage({username, group, color, message}))
  }
  // chatroom.addMessage(username, group, color, message)
  // saveState(channel)
  // rerender()
}

let rerender = _.throttle(function () {
  let chatroom = findChatroom(channel)
  window.chatroom = chatroom
  root.render(
   <Chatroom channel={channel} chatroom={chatroom} />
  )
}, 2000)

client.on("message", onMessageHandler)
client.connect()

// rerender()
// restoreState(channel)

/*
root.render(
 <Provider store={store}>
  <Chatroom />
 </Provider>
)
*/
buildEmoteLookupDict(channel).then(() => {
  root.render(
    <Provider store={store}>
      <Chatroom />
    </Provider>
  )
})
