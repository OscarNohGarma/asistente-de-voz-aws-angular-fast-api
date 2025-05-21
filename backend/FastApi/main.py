from datetime import datetime
import shutil
from typing import Optional
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from pathlib import Path
from model.bitacora_connection import BitacoraConnection
from schema.bitacora import BitacoraSchema
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
from routers import correo_router
from routers import audio

app = FastAPI()
usuario_conn = UserConnection()
paciente_conn = PacienteConnection()  # conexión para pacientes
alerta_conn = AlertaConnection()  # conexión para alertas
bitacora_conn = BitacoraConnection()

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
app.include_router(correo_router.router)
app.include_router(audio.router)


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
    for data in usuario_conn.read_all():
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
    data = usuario_conn.read_one(id)
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
    usuario_conn.write(data)
    return {"message": "Usuario insertado correctamente", "usuario": data}


@app.put("/usuario/{id}")
def update_usuario(id: str, user_data: UserSchema):
    data = user_data.dict()
    data["id"] = id
    usuario_conn.update(id, data)
    return {"message": "Usuario actualizado correctamente", "usuario_actualizado": data}


@app.delete("/usuario/{id}")
def delete_usuario(id: str):
    usuario_conn.delete(id)
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
                "foto_url": f"{data[2]}",  # Asumiendo que 'foto_url' es el nombre del archivo
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
            "foto_url": f"{data[2]}",  # Asumiendo que 'foto_url' es el nombre del archivo
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
async def insert_paciente(
    nombre_completo: str = Form(...),
    edad: int = Form(...),
    habitacion: str = Form(...),
    diagnostico: str = Form(...),
    fecha_ingreso: datetime = Form(...),
    activo: bool = Form(...),
    telefono_familiar: str = Form(...),
    correo_familiar: str = Form(...),
    file: UploadFile = File(...),
):
    try:
        # Definir la carpeta donde se guardarán las fotos
        upload_folder = Path("static/pacientes_fotos")
        upload_folder.mkdir(parents=True, exist_ok=True)

        # Crear nombre de archivo
        filename = f"{nombre_completo.replace(' ', '_')}_{edad}.jpg"
        file_path = upload_folder / filename

        # Guardar foto
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        foto_url = f"/static/pacientes_fotos/{filename}"

        # Armar diccionario de datos
        data = {
            "nombre_completo": nombre_completo,
            "foto_url": foto_url,
            "edad": edad,
            "habitacion": habitacion,
            "diagnostico": diagnostico,
            "fecha_ingreso": fecha_ingreso,
            "activo": activo,
            "telefono_familiar": telefono_familiar,
            "correo_familiar": correo_familiar,
        }

        # Guardar en BD
        paciente_conn.write(data)

        return {"message": "Paciente insertado correctamente", "paciente": data}

    except Exception as e:

        raise HTTPException(
            status_code=500, detail=f"Error al guardar la foto: {str(e)}"
        )


@app.put("/paciente/{id}")
async def update_paciente(
    id: str,
    nombre_completo: str = Form(...),
    edad: int = Form(...),
    habitacion: str = Form(...),
    diagnostico: str = Form(...),
    fecha_ingreso: datetime = Form(...),
    activo: bool = Form(...),
    telefono_familiar: str = Form(...),
    correo_familiar: str = Form(...),
    file: Optional[UploadFile] = File(None),
):
    try:
        print("📥 Iniciando actualización de paciente")

        paciente_existente = paciente_conn.read_one(id)
        if not paciente_existente:
            raise HTTPException(status_code=404, detail="Paciente no encontrado")

        # Imprimir la respuesta para depuración
        print("Paciente existente:", paciente_existente)

        # Desempaquetar los 11 valores de la tupla
        (
            id_existente,
            nombre_completo_existente,
            foto_url_existente,
            edad_existente,
            habitacion_existente,
            diagnostico_existente,
            fecha_ingreso_existente,
            activo_existente,
            telefono_familiar_existente,
            correo_familiar_existente,
            foto_extra,
        ) = paciente_existente

        # Si se envió una nueva foto
        if file:
            print(f"📸 Guardando nueva foto: {file.filename}")
            upload_folder = Path("static/pacientes_fotos")
            upload_folder.mkdir(parents=True, exist_ok=True)
            # Eliminar la foto anterior si no es la de default
            if foto_url_existente and "default.jpg" not in foto_url_existente:
                try:
                    foto_anterior_path = Path(
                        foto_url_existente.strip("/")
                    )  # elimina / inicial
                    if foto_anterior_path.exists():
                        foto_anterior_path.unlink()
                        print(f"🗑️ Foto anterior eliminada: {foto_anterior_path}")
                except Exception as delete_error:
                    print(f"⚠️ No se pudo eliminar la foto anterior: {delete_error}")

            filename = f"{nombre_completo.replace(' ', '_')}_{edad}.jpg"
            file_path = upload_folder / filename

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            foto_url = f"/static/pacientes_fotos/{filename}"
        else:
            print("📸 No se envió nueva foto, manteniendo la actual")
            foto_url = (
                foto_url_existente
                if foto_url_existente
                else "/static/pacientes_fotos/default.jpg"
            )  # Fallback si no existe foto

        # Datos a actualizar
        data = {
            "id": id,
            "nombre_completo": nombre_completo,
            "foto_url": foto_url,
            "edad": edad,
            "habitacion": habitacion,
            "diagnostico": diagnostico,
            "fecha_ingreso": fecha_ingreso,
            "activo": activo,
            "telefono_familiar": telefono_familiar,
            "correo_familiar": correo_familiar,
        }

        # Actualizar en la base de datos
        paciente_conn.update(id, data)

        return {
            "message": "Paciente actualizado correctamente",
            "paciente_actualizado": data,
        }

    except Exception as e:
        print(f"❌ Error en servidor: {e}")
        raise HTTPException(status_code=500, detail=str(e))


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
    with usuario_conn.conn.cursor() as cur:
        cur.execute(
            """
            SELECT 
                a.id, a.id_paciente, a.tipo, a.estado, a.fecha,
                a.nueva, a.palabras_clave,
                p.nombre_completo, p.foto_url, p.habitacion, p.edad, p.diagnostico
            FROM alertas a
            JOIN pacientes p ON a.id_paciente::int = p.id
        """
        )
        alertas = []
        for row in cur.fetchall():
            alerta = {
                "id": row[0],
                "id_paciente": row[1],
                "tipo": row[2],
                "estado": row[3],
                "fecha": row[4],
                "nueva": row[5],
                "palabras_clave": row[6],
                "paciente": {
                    "nombre_completo": row[7],
                    "foto_url": row[8],
                    "habitacion": row[9],
                    "edad": row[10],
                    "diagnostico": row[11],
                },
            }
            alertas.append(alerta)
        return alertas


@app.get("/alerta/{id}")
def get_alerta(id: str):
    with usuario_conn.conn.cursor() as cur:
        cur.execute(
            """
            SELECT 
                a.id, a.id_paciente, a.tipo, a.estado, a.fecha,
                a.nueva, a.palabras_clave,
                p.nombre_completo, p.foto_url, p.habitacion, p.edad, p.diagnostico
            FROM alertas a
            JOIN pacientes p ON a.id_paciente::int = p.id
            WHERE a.id = %s
            """,
            (id,),
        )
        row = cur.fetchone()
        if row:
            return {
                "id": row[0],
                "id_paciente": row[1],
                "tipo": row[2],
                "estado": row[3],
                "fecha": str(row[4]) if row[4] else None,
                "nueva": row[5],
                "palabras_clave": row[6],
                "paciente": {
                    "nombre_completo": row[7],
                    "foto_url": row[8],
                    "habitacion": row[9],
                    "edad": row[10],
                    "diagnostico": row[11],
                },
            }
        else:
            return {"message": "Alerta no encontrada"}


@app.post("/alerta")
def insert_alerta(alerta_data: AlertaSchema):
    data = alerta_data.dict()
    data.pop("id", None)
    new_id = alerta_conn.write(data)
    data["id"] = new_id  # Añade el id a los datos de respuesta
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


# ========================
#      RUTAS BITÁCORA
# ========================


@app.get("/bitacora")
def get_bitacora():
    with usuario_conn.conn.cursor() as cur:
        cur.execute(
            """
            SELECT
                b.id, b.id_alerta, b.accion, b.usuario, b.descripcion, b.fecha_accion,
                a.id_paciente, a.tipo, a.estado, a.fecha, a.nueva, a.palabras_clave,
                p.nombre_completo, p.foto_url, p.habitacion, p.edad, p.diagnostico
            FROM bitacora b
            JOIN alertas a ON b.id_alerta = a.id
            JOIN pacientes p ON a.id_paciente::int = p.id
            ORDER BY b.fecha_accion DESC;
            """
        )
        registros = []
        for row in cur.fetchall():
            registros.append(
                {
                    "id": row[0],
                    "id_alerta": row[1],
                    "accion": row[2],
                    "usuario": row[3],
                    "descripcion": row[4],
                    "fecha_accion": str(row[5]),
                    "alerta": {
                        "id_paciente": row[6],
                        "tipo": row[7],
                        "estado": row[8],
                        "fecha": str(row[9]),
                        "nueva": row[10],
                        "palabras_clave": row[11],
                        "paciente": {
                            "nombre_completo": row[12],
                            "foto_url": row[13],
                            "habitacion": row[14],
                            "edad": row[15],
                            "diagnostico": row[16],
                        },
                    },
                }
            )
        return registros


@app.get("/bitacora/{id}")
def get_bitacora_por_id(id: int):
    r = bitacora_conn.read_one(id)
    if r:
        return {
            "id": r[0],
            "id_alerta": r[1],
            "accion": r[2],
            "usuario": r[3],
            "descripcion": r[4],
            "fecha_accion": str(r[5]) if r[5] else None,
        }
    else:
        return {"message": "Registro de bitácora no encontrado"}


@app.get("/bitacora/alerta/{id_alerta}")
def get_bitacora_por_alerta(id_alerta: int):
    registros = bitacora_conn.read_by_alerta(id_alerta)
    resultado = [
        {
            "id": r[0],
            "id_alerta": r[1],
            "accion": r[2],
            "usuario": r[3],
            "descripcion": r[4],
            "fecha_accion": str(r[5]) if r[5] else None,
        }
        for r in registros
    ]
    return resultado


@app.post("/bitacora")
def insertar_bitacora(registro: BitacoraSchema):
    data = registro.dict()
    data.pop("id", None)
    bitacora_conn.write(data)
    return {"message": "Registro de bitácora insertado correctamente", "bitacora": data}


@app.delete("/bitacora/{id}")
def delete_paciente(id: str):
    paciente_conn.delete(id)
    return {"message": f"Bitacora con id {id} eliminado correctamente"}


@app.delete("/bitacora")
def eliminar_toda_bitacora():
    bitacora_conn.delete_all()
    return {
        "message": "Todos los registros de bitácora fueron eliminados correctamente"
    }
