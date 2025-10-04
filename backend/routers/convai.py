from fastapi import APIRouter, WebSocket, Depends
from sqlalchemy.orm import Session
from db import conn
from config import Config
import json
import asyncio
import websockets

router = APIRouter()

async def send_audio_chunk(ell_ws, chunk_b64: str):
    try:
        message = json.dumps({
            "user_audio_chunk": chunk_b64
        })
        await ell_ws.send(message)
    except websockets.exceptions.ConnectionClosed:
        raise
    except Exception as e:
        raise

async def listen_for_responses(ws: WebSocket, ell_ws):
    async for message in ell_ws:
        try:
            data = json.loads(message)
            message_type = data.get("type")

            print(f"Received message from ElevenLabs: {message_type}")

            if message_type == "agent_response_correction":
                continue # ignore agent correction events
            
            await ws.send_json(data)
        except json.JSONDecodeError as e:
            print(f"Failed to decode message from ElevenLabs: {e}")
        except Exception as e:
            print(f"Error in listen_for_responses: {e}")

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, db: Session = Depends(conn.get_db)):
    await websocket.accept()
    
    API_KEY  = Config.AI_API_KEY
    AGENT_ID = Config.AI_AGENT_ID    
    WS_URL   = f"wss://api.elevenlabs.io/v1/convai/conversation?agent_id={AGENT_ID}"
    print(f"Connecting to ElevenLabs WebSocket: {WS_URL}")

    try:
        ell_ws = await websockets.connect(
            WS_URL,
            additional_headers={"xi-api-key": API_KEY}
        )
    except websockets.exceptions.InvalidStatusCode as e:
        error_msg = f"ElevenLabs connection failed with status {e.status_code}"
        await websocket.close(code=1002, reason=error_msg)
        return
    except Exception as e:
        error_msg = f"Failed to connect to ElevenLabs: {str(e)}"
        await websocket.close(code=1011, reason=error_msg)
        return

    listener_task = asyncio.create_task(listen_for_responses(websocket, ell_ws))

    try:
        async for message in websocket.iter_text():
            try:
                data = json.loads(message)
                if data.get("type") == "user_audio_chunk" and data.get("audio_chunk"):
                    await send_audio_chunk(ell_ws, data["audio_chunk"])
            except json.JSONDecodeError:
                print(f"Invalid JSON received from frontend: {message[:100]}")
                await websocket.send_json({"type": "error", "message": "Invalid JSON format"})
            except websockets.exceptions.ConnectionClosed:
                print("ElevenLabs connection closed during message processing")
                await websocket.send_json({"type": "error", "message": "ElevenLabs connection lost"})
                break
            except Exception as e:
                print(f"Error processing audio message: {e}")
                await websocket.send_json({"type": "error", "message": str(e)})

    except websockets.exceptions.ConnectionClosed:
        print("ElevenLabs connection closed")
    except Exception as e:
        print(f"Error in audio loop: {e}")
    finally:
        if not listener_task.done():
            listener_task.cancel()
        try:
            await ell_ws.close()
        except:
            pass
        try:
            await websocket.close()
        except:
            pass