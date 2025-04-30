import psycopg
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)


class UserConnection:
    def __init__(self):
        self.conn = None
        try:
            self.conn = psycopg.connect(
                dbname=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                host=os.getenv("DB_HOST"),
                port=os.getenv("DB_PORT"),
            )
            self.conn.execute("SET client_encoding TO 'UTF8'")
        except psycopg.OperationalError as err:
            print(f"Connection error: {err}")
            if self.conn:
                self.conn.close()

    def read_all(self):
        with self.conn.cursor() as cur:
            cur.execute(
                """ 
                SELECT * FROM "usuarios"
            """
            )
            return cur.fetchall()

    def read_one(self, id):
        with self.conn.cursor() as cur:
            cur.execute(
                """ 
                SELECT * FROM "usuarios" WHERE id = %s
            """,
                (id,),
            )
            return cur.fetchone()

    def write(self, data):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """ 
                    INSERT INTO "usuarios" (
                        nombre_completo, correo, contrasena, rol, fecha_creacion, activo
                    ) VALUES (
                        %(nombre_completo)s, %(correo)s, %(contrasena)s, %(rol)s, %(fecha_creacion)s, %(activo)s
                    )
                """,
                    data,
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al insertar en la base de datos:", e)
            raise e

    def update(self, id, data):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """ 
                    UPDATE "usuarios"
                    SET nombre_completo = %(nombre_completo)s,
                        correo = %(correo)s,
                        contrasena = %(contrasena)s,
                        rol = %(rol)s,
                        fecha_creacion = %(fecha_creacion)s,
                        activo = %(activo)s
                    WHERE id = %(id)s
                """,
                    data,
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al actualizar en la base de datos:", e)
            raise e

    def delete(self, id):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """ 
                    DELETE FROM "usuarios" WHERE id = %s
                """,
                    (id,),
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al eliminar en la base de datos:", e)
            raise e

    def __del__(self):
        if self.conn:
            self.conn.close()
