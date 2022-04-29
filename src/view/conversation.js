import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';
import Color from 'color';
import { now, reduceColor, getHash } from '../utils'
import { Message } from './message'
import { Emote } from './emote'
import { ConversationStyle, Username } from '../styles/conversation'
import { lookupEmote, isEmote } from '../emotes'

class Conversation extends React.Component {
  render() {
    let color = this.props.color;

    let fontWeight = 'normal';
    let fontSize = 12;
    if (_.any(_.map(this.props.messages, (message) => message.timestamp > now() - 30))) {
      fontWeight = 'bold';
      // fontSize = 14;
    }
    let recentEmotes = _.last(this.props.emotes, 3)
    let userEmotes;
    if (recentEmotes.length > 0) {
      userEmotes = _.map(_.filter(recentEmotes, (emote) => emote.timestamp > now() - 60), (emote) => {
        return <Emote name={emote.content} />
      })
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
        }}>{this.props.username} {userEmotes}</Username>
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