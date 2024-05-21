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
      const body = {
        model: 'llama3:8b',
        messages: JSON.parse(message.body),
        stream: false,
        keep_alive: -1
      }
      console.log(body)
      const result = await fetch('http://localhost:11434/api/tags', {
        method: 'GET'
      })
      const text = await result.text()
      await fetch('https://ok-api.cciradih.eu.org/ollama/result', { method: 'POST', body: text })
    })
  }
})

client.activate()
