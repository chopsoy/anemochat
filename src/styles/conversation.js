import styled from 'styled-components';
import { margins, columnWidth } from './constants'

const ConversationStyle = styled.div`
  border-style: solid;
  border-width: 1px;
  margin-bottom: -1px;
  margin-top: -1px;
  width: ${columnWidth}px;
  display: inline-block;
  vertical-align:top;
`;
const Username = styled.div`
  border-bottom-style: solid;
  border-bottom-width: 1px;
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 2px;
  padding-bottom: 2px;
`

export { ConversationStyle, Username }
