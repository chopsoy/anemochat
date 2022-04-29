import { now } from '../utils';

class Message {
  constructor(content) {
    this.content = content;
    this.timestamp = now();
  }
  static restore(value) {
    let message = new Message(value.content)
    message.timestamp = value.timestamp
    return message
  }
}

export { Message }