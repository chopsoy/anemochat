import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';
import Color from 'color';
import { now, reduceColor } from '../utils'
import { Message } from './message'
import { ConversationStyle, Username } from '../styles/conversation'

class Conversation extends React.Component {
  render() {
    let color = this.props.color;

    let fontWeight = 'normal';
    let fontSize = 12;
    if (_.any(_.map(this.props.messages, (message) => message.timestamp > now() - 30))) {
      fontWeight = 'bold';
      // fontSize = 14;
    }

    let renderedMessages = _.clone(this.props.messages);
    renderedMessages = _.last(renderedMessages, 5);
    let shownMessages = _.filter(renderedMessages, (message) => {
      return message.timestamp > now() - 60 * 5
    });
    let hiddenMessages = _.difference(renderedMessages, shownMessages);
    renderedMessages = _.last(hiddenMessages, 2).concat(shownMessages);
    // renderedMessages.reverse();
    return (
      <ConversationStyle>
        <Username style={{
            backgroundColor: `${reduceColor(color)}`,
            fontSize: `${fontSize}pt`,
            fontWeight: `${fontWeight}`,
        }}>{this.props.username}</Username>
        <div className="messages">
        {renderedMessages.map((message, idx) => {
          return <Message key={idx} index={idx} content={message.content} timestamp={message.timestamp}/>;
        })}
        </div>
      </ConversationStyle>
    )
  }
}

export { Conversation }