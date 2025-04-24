# alert_websocket.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter()

connected_clients = []


@router.websocket("/ws/alertas")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_clients.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Mensaje recibido: {data}")
            for client in connected_clients:
                await client.send_text(data)
    except WebSocketDisconnect:
        connected_clients.remove(websocket)
