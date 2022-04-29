import styled from 'styled-components';
import { margins, columnWidth } from './constants'

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
  margin-left: -1px;
  margin-right: -1px;
  display: inline-block;
`;
const ChannelTitle = styled.div`
  font-size: 24px;
  margin-bottom: 16px;
`

export { ConversationCategory, ChatRoom, ConversationTitle, ConversationList, ChannelTitle }