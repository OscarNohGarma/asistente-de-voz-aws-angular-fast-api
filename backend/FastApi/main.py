from fastapi import FastAPI
from model.user_connection import UserConnection
from model.paciente_connection import PacienteConnection
from model.alerta_connection import AlertaConnection
from schema.user_schema import UserSchema
from schema.paciente_schema import PacienteSchema
from schema.alerta_schema import AlertaSchema
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os

from routers import alert_websocket

app = FastAPI()
conn = UserConnection()
paciente_conn = PacienteConnection()  # conexión para pacientes
alerta_conn = AlertaConnection()  # conexión para alertas

app.include_router(alert_websocket.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/favicon.ico")
def favicon():
    favicon_path = os.path.join("static", "favicon.ico")
    return FileResponse(favicon_path)

# ========================
#      RUTAS USUARIOS
# ========================

@app.get("/usuario")
def get_usuarios():
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


@app.get("/usuario/{id}")
def get_usuario(id: str):
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


@app.post("/usuario")
def insert_usuario(user_data: UserSchema):
    data = user_data.dict()
    data.pop("id", None)
    conn.write(data)
    return {"message": "Usuario insertado correctamente", "usuario": data}


@app.put("/usuario/{id}")
def update_usuario(id: str, user_data: UserSchema):
    data = user_data.dict()
    data["id"] = id
    conn.update(id, data)
    return {"message": "Usuario actualizado correctamente", "usuario_actualizado": data}


@app.delete("/usuario/{id}")
def delete_usuario(id: str):
    conn.delete(id)
    return {"message": f"Usuario con id {id} eliminado correctamente"}


# ========================
#      RUTAS PACIENTES
# ========================

@app.get("/paciente")
def get_pacientes():
    items = []
    for data in paciente_conn.read_all():
        items.append(
            {
                "id": data[0],
                "nombre_completo": data[1],
                "foto_url": data[2],
                "edad": data[3],
                "habitacion": data[4],
                "diagnostico": data[5],
                "fecha_ingreso": str(data[6]),
                "activo": data[7],
            }
        )
    return JSONResponse(content=items, media_type="application/json; charset=utf-8")


@app.get("/paciente/{id}")
def get_paciente(id: str):
    data = paciente_conn.read_one(id)
    if data:
        return {
            "id": data[0],
            "nombre_completo": data[1],
            "foto_url": data[2],
            "edad": data[3],
            "habitacion": data[4],
            "diagnostico": data[5],
            "fecha_ingreso": str(data[6]),
            "activo": data[7],
        }
    else:
        return {"message": "Paciente no encontrado"}


@app.post("/paciente")
def insert_paciente(paciente_data: PacienteSchema):
    data = paciente_data.dict()
    data.pop("id", None)
    paciente_conn.write(data)
    return {"message": "Paciente insertado correctamente", "paciente": data}


@app.put("/paciente/{id}")
def update_paciente(id: str, paciente_data: PacienteSchema):
    data = paciente_data.dict()
    data["id"] = id
    paciente_conn.update(id, data)
    return {"message": "Paciente actualizado correctamente", "paciente_actualizado": data}


@app.delete("/paciente/{id}")
def delete_paciente(id: str):
    paciente_conn.delete(id)
    return {"message": f"Paciente con id {id} eliminado correctamente"}


# ========================
#      RUTAS ALERTAS
# ========================

@app.get("/alerta")
def get_alertas():
    items = []
    for data in alerta_conn.read_all():
        items.append(
            {
                "id": data[0],
                "id_pacientes": data[1],
                "tipo": data[2],
                "hora": data[3],
                "estado": data[4],
                "confirmada_por": data[5],
                "fecha_confirmacion": str(data[6]) if data[6] else None,
            }
        )
    return JSONResponse(content=items, media_type="application/json; charset=utf-8")


@app.get("/alerta/{id}")
def get_alerta(id: str):
    data = alerta_conn.read_one(id)
    if data:
        return {
            "id": data[0],
            "id_pacientes": data[1],
            "tipo": data[2],
            "hora": data[3],
            "estado": data[4],
            "confirmada_por": data[5],
            "fecha_confirmacion": str(data[6]) if data[6] else None,
        }
    else:
        return {"message": "Alerta no encontrada"}


@app.post("/alerta")
def insert_alerta(alerta_data: AlertaSchema):
    data = alerta_data.dict()
    data.pop("id", None)
    alerta_conn.write(data)
    return {"message": "Alerta insertada correctamente", "alerta": data}


@app.put("/alerta/{id}")
def update_alerta(id: str, alerta_data: AlertaSchema):
    data = alerta_data.dict()
    data["id"] = id
    alerta_conn.update(id, data)
    return {"message": "Alerta actualizada correctamente", "alerta_actualizada": data}


@app.delete("/alerta/{id}")
def delete_alerta(id: str):
    alerta_conn.delete(id)
    return {"message": f"Alerta con id {id} eliminada correctamente"}
