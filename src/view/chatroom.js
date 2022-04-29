import React from 'react';
import _ from 'underscore';
import Color from 'color';
import { Conversation } from './conversation'
import { useSelector } from 'react-redux'
import { ConversationCategory, ChatRoom, ConversationTitle, ConversationList, ChannelTitle } from "../styles/chatroom"

function Chatroom() {
  const chatroom = useSelector(state => state.chatroom)
  let allConversations = chatroom.conversationOrder.map((username) => chatroom.conversations[username])
  let convoCategories = Object.fromEntries(
    _.map([['everyone'], ['vip', 'mod', 'broadcaster']], (groups) => {
      let conversations = _.filter(allConversations,
        (conversation) => _.contains(groups, conversation.group));
      conversations = _.first(conversations, 20);
      return [groups.join(', '), conversations];
    })
  );
  /*
  let convoCategories = {
    'all': allConversations
  }
  */
  return (
    <ChatRoom>
      <ChannelTitle>{}</ChannelTitle>
      {_.map(convoCategories, (conversations, key) => {
        return <ConversationCategory key={key}>
          <ConversationTitle>{key}</ConversationTitle>
          <ConversationList>
          {_.map(conversations, (conversation) => {
            return <Conversation
              key={conversation.username}
              color={conversation.color}
              username={conversation.username} 
              messages={conversation.messages}
            />;
          })}
          </ConversationList>
        </ConversationCategory>;
      })}
    </ChatRoom>
  )
}

export { Chatroom }