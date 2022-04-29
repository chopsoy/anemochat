import React from 'react';
import _ from 'underscore';
import styled from 'styled-components';
import Color from 'color';
import { now } from '../utils'
import { lookupEmote, isEmote } from '../emotes'

class Emote extends React.Component {
  render() {
    let emoteInfo = lookupEmote(this.props.name)
    return <img
      src={ emoteInfo.url }
      alt={ emoteInfo.name }
      style={{
        width: emoteInfo.width,
        height: emoteInfo.height,
        marginLeft: '5px',
        marginRight: '5px',
      }}
    />
  }
}

export { Emote }