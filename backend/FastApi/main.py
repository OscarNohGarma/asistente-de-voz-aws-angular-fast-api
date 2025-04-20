from fastapi import FastAPI
from model.user_connection import UserConnection
from schema.user_schema import UserSchema
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
import os

app = FastAPI()
conn = UserConnection()

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/favicon.ico")
def favicon():
    favicon_path = os.path.join("static", "favicon.ico")
    return FileResponse(favicon_path)


@app.get("/")
def root():
    items = []
    for data in conn.read_all():
        items.append(
            {
                "id": data[0],
                "nombre_completo": data[1],
                "correo": data[2],
                "contrasena": data[3],
                "rol": data[4],
                "fecha_creacion": str(data[5]),
                "activo": data[6],
            }
        )
    return JSONResponse(content=items, media_type="application/json; charset=utf-8")


@app.get("/{id}")
def get_one(id: str):
    data = conn.read_one(id)
    if data:
        return {
            "id": data[0],
            "nombre_completo": data[1],
            "correo": data[2],
            "contrasena": data[3],
            "rol": data[4],
            "fecha_creacion": data[5],
            "activo": data[6],
        }
    else:
        return {"message": "Usuario no encontrado"}


@app.post("/")
def insert(user_data: UserSchema):
    data = user_data.dict()
    data.pop("id", None)  # Eliminar ID si es autogenerado
    conn.write(data)
    return {"message": "Usuario insertado correctamente", "usuario": data}


@app.put("/{id}")
def update(id: str, user_data: UserSchema):
    data = user_data.dict()
    conn.update(id, data)
    return {"message": "Usuario actualizado correctamente", "usuario_actualizado": data}


@app.delete("/{id}")
def delete(id: str):
    conn.delete(id)
    return {"message": f"Usuario con id {id} eliminado correctamente"}
