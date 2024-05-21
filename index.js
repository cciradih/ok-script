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
        body: {
          model: '',
          messages: JSON.parse(message.body),
        },
        stream: false,
        keep_alive: -1
      })
      await fetch('htts://ok-api.cciradih.eu.org/ollama/result', { method: 'POST', body: result.json() })
    })
  }
})

client.activate()
