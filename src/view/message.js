import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';
import Color from 'color';
import { now, getHash } from '../utils'
import { MessageStyle } from '../styles/message'
import { Emote } from './emote'
import { lookupEmote, isEmote } from '../emotes'

class Message extends React.Component {
  render() {
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
      maxLineWidth = 160;
    } else if (this.props.timestamp > now() - 60 * 5) {
      fontColor = '808080'
    } else {
      fontColor = 'C0C0C0'
      maxLineWidth = 40;
    }

    let renderedContent = this.props.content;
    if (this.props.content.length > maxLineWidth) {
      renderedContent = renderedContent.substring(0, maxLineWidth);
      renderedContent += '...';
    }
    
    let renderedContentList = []
    let currentPhrase = []
    renderedContent = _.each(renderedContent.split(' '), (word, idx) => {
      if (isEmote(word)) {
        if (currentPhrase.length > 0) {
          renderedContentList.push(<span key={renderedContentList.length}>{currentPhrase.join(' ')}</span>)
          currentPhrase = []
        }
        renderedContentList.push(<Emote key={renderedContentList.length} name={word} />)
      } else {
        currentPhrase.push(word)
      }
    })
    if (currentPhrase.length > 0) {
      renderedContentList.push(<span key={renderedContentList.length}>{currentPhrase.join(' ')}</span>)
    }

    return <MessageStyle style={{
      backgroundColor: `${this.props.index % 2 === 0 ? 'rgba(255, 255, 255, 0.5)' : 'rgba(200, 200, 200, 0.5)'}`,
      fontSize: `${fontSize}pt`,
      fontWeight: `${fontWeight}`,
      color: `#${fontColor}`,
    }}>{renderedContentList}</MessageStyle>
  }
}

export { Message }