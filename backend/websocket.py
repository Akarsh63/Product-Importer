from typing import Dict
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        await self.send_progress(client_id, {
            'message': 'ih'
        })

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def send_progress(self, client_id: str, message: dict):
        websocket = self.active_connections.get(client_id)
        if websocket:
            await websocket.send_json(message)
            print(client_id, message)

manager = ConnectionManager()