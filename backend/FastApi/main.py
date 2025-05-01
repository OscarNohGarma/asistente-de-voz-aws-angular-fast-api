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
from routers import audio_detection  # Asegúrate de importar tu router
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

# Montar rutas
app.include_router(audio_detection.router)


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

from fastapi.responses import JSONResponse

@app.get("/paciente")
def get_pacientes():
    items = []
    for data in paciente_conn.read_all():
        items.append(
            {
                "id": data[0],
                "nombre_completo": data[1],
                "foto_url": f"/static/pacientes_fotos/{data[2]}",  # Asumiendo que 'foto_url' es el nombre del archivo
                "edad": data[3],
                "habitacion": data[4],
                "diagnostico": data[5],
                "fecha_ingreso": str(data[6]),
                "activo": data[7],
                "telefono_familiar": data[8],
                "correo_familiar": data[9],
                # "embedding": data[10],
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
            "foto_url": f"/static/pacientes_fotos/{data[2]}",  # Asumiendo que 'foto_url' es el nombre del archivo
            "edad": data[3],
            "habitacion": data[4],
            "diagnostico": data[5],
            "fecha_ingreso": str(data[6]),
            "activo": data[7],
            "telefono_familiar": data[8],
            "correo_familiar": data[9],
        }
    else:
        return {"message": "Paciente no encontrado"}

@app.post("/paciente")
async def insert_paciente(paciente_data: PacienteSchema, file: UploadFile = File(...)):
    try:
        # Definir la carpeta donde se guardarán las fotos
        upload_folder = Path("static/pacientes_fotos")
        upload_folder.mkdir(parents=True, exist_ok=True)

        # Crear un nombre de archivo único basado en el nombre del paciente y la edad
        filename = f"{paciente_data.nombre_completo.replace(' ', '_')}_{paciente_data.edad}.jpg"

        # Ruta completa del archivo
        file_path = upload_folder / filename

        # Guardar el archivo en la ruta especificada
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Actualizar la URL de la foto
        paciente_data.foto_url = f"/static/pacientes_fotos/{filename}"

        # Insertar paciente en la base de datos
        data = paciente_data.dict()
        data.pop("id", None)  # Eliminar id si viene en los datos
        paciente_conn.write(data)
        
        return {"message": "Paciente insertado correctamente", "paciente": data}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar la foto: {str(e)}")


@app.put("/paciente/{id}")
def update_paciente(id: str, paciente_data: PacienteSchema):
    data = paciente_data.dict()
    data["id"] = id
    paciente_conn.update(id, data)
    return {
        "message": "Paciente actualizado correctamente",
        "paciente_actualizado": data,
    }


@app.delete("/paciente/{id}")
def delete_paciente(id: str):
    paciente_conn.delete(id)
    return {"message": f"Paciente con id {id} eliminado correctamente"}


@app.delete("/paciente")
def delete_all_pacientes():
    paciente_conn.delete_all()
    return {"message": "Todos los pacientes han sido eliminados correctamente"}


# ========================
#      RUTAS ALERTAS
# ========================


@app.get("/alerta")
def get_alertas():
    with conn.conn.cursor() as cur:
        cur.execute(
            """
            SELECT 
                a.id, a.id_pacientes, a.tipo, a.hora, a.estado, a.confirmada_por, a.fecha_confirmacion,
                a.nueva, a.palabras_clave,
                p.nombre_completo, p.foto_url, p.habitacion, p.edad, p.diagnostico
            FROM alertas a
            JOIN pacientes p ON a.id_pacientes::int = p.id
        """
        )
        alertas = []
        for row in cur.fetchall():
            alerta = {
                "id": row[0],
                "id_pacientes": row[1],
                "tipo": row[2],
                "hora": row[3],
                "estado": row[4],
                "confirmada_por": row[5],
                "fecha_confirmacion": row[6],
                "nueva": row[7],
                "palabras_clave": row[8],
                "paciente": {
                    "nombre_completo": row[9],
                    "foto_url": row[10],
                    "habitacion": row[11],
                    "edad": row[12],
                    "diagnostico": row[13],
                },
            }
            alertas.append(alerta)
        return alertas


@app.get("/alerta/{id}")
def get_alerta(id: str):
    with conn.conn.cursor() as cur:
        cur.execute(
            """
            SELECT 
                a.id, a.id_pacientes, a.tipo, a.hora, a.estado, a.confirmada_por, a.fecha_confirmacion,
                a.nueva, a.palabras_clave,
                p.nombre_completo, p.foto_url, p.habitacion, p.edad, p.diagnostico
            FROM alertas a
            JOIN pacientes p ON a.id_pacientes::int = p.id
            WHERE a.id = %s
            """,
            (id,),
        )
        row = cur.fetchone()
        if row:
            return {
                "id": row[0],
                "id_pacientes": row[1],
                "tipo": row[2],
                "hora": row[3],
                "estado": row[4],
                "confirmada_por": row[5],
                "fecha_confirmacion": str(row[6]) if row[6] else None,
                "nueva": row[7],
                "palabras_clave": row[8],
                "paciente": {
                    "nombre_completo": row[9],
                    "foto_url": row[10],
                    "habitacion": row[11],
                    "edad": row[12],
                    "diagnostico": row[13],
                },
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


@app.delete("/alerta")
def delete_all_alertas():
    alerta_conn.delete_all()
    return {"message": "Todas las alertas han sido eliminados correctamente"}
