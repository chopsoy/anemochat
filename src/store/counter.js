import React from 'react'
import { useSelector } from 'react-redux'
export function Counter() {
  const chatroom = useSelector(state => state.chatroom)

  return (
    <div>
      <div>
        <span>{JSON.stringify(chatroom)}</span>
      </div>
    </div>
  )
}