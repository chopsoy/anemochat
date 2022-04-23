import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';
import Color from 'color';

class Message extends React.Component {
  render () {
    let fontColor;
    let fontWeight = 'normal';
    let fontSize = 10;
    let maxLineWidth = 80;
    if (this.props.timestamp > now() - 30) {
      fontWeight = 'bold'
      fontColor = '000000'
      maxLineWidth = 160;
      // fontSize = 12;
    }
    else if (this.props.timestamp > now() - 60 * 2) {
      fontColor = '000000'
    } else if (this.props.timestamp > now() - 60 * 5) {
      fontColor = '808080'
    } else {
      fontColor = 'C0C0C0'
      maxLineWidth = 40;
    }
    const Message = styled.div`
      font-weight: ${fontWeight};
      color: #${fontColor};
      background-color: ${this.props.index % 2 === 0 ? 'white' : '#EEEEEE'};
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 2px;
      padding-bottom: 2px;
      font-size: ${fontSize}pt;
    `;
    let renderedContent = this.props.content;
    if (this.props.content.length > maxLineWidth) {
      renderedContent = renderedContent.substring(0, maxLineWidth);
      renderedContent += '...';
    }
    return <Message>{renderedContent}</Message>
  }
}

function now() {
  return Math.floor((new Date()).getTime() / 1000);
}

class Conversation extends React.Component {
  render() {
    let color = this.props.color;
    const Conversation = styled.div`
      border-style: solid;
      border-width: 1px;
      margin-bottom: -1px;
      margin-top: -1px;
      width: ${columnWidth}px;
      display: inline-block;
      vertical-align:top;
    `;
    let fontWeight = 'normal';
    let fontSize = 12;
    if (_.any(_.map(this.props.messages, (message) => message.timestamp > now() - 30))) {
      fontWeight = 'bold';
      // fontSize = 14;
    }
    const Username = styled.div`
      border-bottom-style: solid;
      border-bottom-width: 1px;
      background-color: ${reduceColor(color)};
      font-weight: ${fontWeight};
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 2px;
      padding-bottom: 2px;
      font-size: ${fontSize}pt;
    `
    let renderedMessages = _.clone(this.props.messages);
    renderedMessages = _.last(renderedMessages, 5);
    let shownMessages = _.filter(renderedMessages, (message) => {
      return message.timestamp > now() - 60 * 5
    });
    let hiddenMessages = _.difference(renderedMessages, shownMessages);
    renderedMessages = _.last(hiddenMessages, 2).concat(shownMessages);
    // renderedMessages.reverse();
    return (
      <Conversation>
        <Username>{this.props.username}</Username>
        <div className="messages">
        {renderedMessages.map((message, idx) => {
          return <Message key={idx} index={idx} content={message.content} timestamp={message.timestamp}/>;
        })}
        </div>
      </Conversation>
    )
  }
}

function reduceColor(color) {
  color = Color(color).hsl();
  let newColor = Color({h: color.color[0], s: color.color[1] / 2, v: color.color[2] / 16 + 15 / 16 * 100});
  return newColor.hex();
}

const columnWidth = 320;
const margins = 20;

class Chatroom extends React.Component {
  render() {
    let allConversations = this.props.conversations;
    let convoCategories = Object.fromEntries(
      _.map(['everyone', 'vip', 'mod'], (group) => {
        let conversations = _.filter(allConversations,
          (conversation) => conversation.group === group);
        conversations.reverse();
        conversations = _.first(conversations, 20);
        return [group, conversations];
      })
    );
    const ConversationCategory = styled.div`
      border-style: solid;
      border-width: 1px;
      margin-right: ${margins}px;
      margin-bottom: ${margins}px;
      width: ${columnWidth}px;
      display: inline-block;
      vertical-align: top;
    `;
    const ChatRoom = styled.div`
      font-family: helvetica;
    `
    const ConversationTitle = styled.div`
      border-bottom-style: solid;
      border-bottom-width: 1px;
      padding-left: 5px;
      padding-right: 5px;
      padding-top: 2px;
      padding-bottom: 2px;
      font-size: 16pt;
    `;
    const ConversationList = styled.div`
      -- padding-top: ${margins}px;
      -- padding-bottom: ${margins}px;
      margin-top: -1px;
      margin-bottom: -1px;
      margin-left: -1px;
      margin-right: -1px;
      display: inline-block;
    `;
    const ChannelTitle = styled.div`
      font-size: 24px;
      margin-bottom: 16px;
    `
    return (
      <ChatRoom>
        <ChannelTitle>{this.props.channel}</ChannelTitle>
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
}

export {Message, Conversation, Chatroom}