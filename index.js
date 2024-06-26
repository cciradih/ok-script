import { Client } from '@stomp/stompjs'
import { WebSocket } from 'ws'

Object.assign(global, { WebSocket })

const client = new Client({
  brokerURL: 'wss://ok-api.cciradih.eu.org/ws',
  // brokerURL: 'ws://localhost:25700/ws',
  onWebSocketError: () => { },
  onStompError: () => { },
  onConnect: () => {
    client.subscribe('/topic/chat', async (message) => {
      const result = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        body: message.body
      })
      const text = await result.text()
      await fetch('https://ok-api.cciradih.eu.org/ollama/result', { method: 'POST', body: text })
    })
  }
})

client.activate()
