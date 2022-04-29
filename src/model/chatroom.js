import _ from 'underscore'
import { Conversation } from './conversation'
import { trimLast, restoreObject} from '../utils'

class Chatroom {
  constructor(channel) {
    this.channel = channel
    this.conversations = {}
  }
  addMessage(username, group, color, message) {
    let conversation = this.conversations[username]
    if (conversation === undefined) {
      conversation = new Conversation(username, group, color)
      this.conversations[username] = conversation
    }
    conversation.addMessage(message)
  }
  static restore(value) {
    let chatroom = new Chatroom(value.channel)
    restoreObject(Conversation, value.conversations, chatroom.conversations)
    return chatroom
  }
}

export { Chatroom }