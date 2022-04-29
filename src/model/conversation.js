import { trimLast } from '../utils'
import { Message } from './message'
import { restoreArray } from '../utils'

const MAX_MESSAGES = 20

class Conversation {
  constructor(username, group, color) {
    this.username = username
    this.group = group
    this.color = color
    this.messages = []
  }
  addMessage(content) {
    this.messages.push(new Message(content))
    trimLast(this.messages, MAX_MESSAGES)
  }
  static restore(value) {
    let conversation = new Conversation(value.username, value.group, value.color)
    restoreArray(Message, value.messages, conversation.messages)
    return conversation
  }
}

export { Conversation }