import psycopg
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)


class BitacoraConnection:
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
            cur.execute("SELECT * FROM bitacora")
            return cur.fetchall()

    def read_one(self, id):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM bitacora WHERE id = %s", (id,))
            return cur.fetchone()

    def read_by_alerta(self, id_alerta):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM bitacora WHERE id_alerta = %s", (id_alerta,))
            return cur.fetchall()

    def write(self, data):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO bitacora (
                        id_alerta, accion, usuario, descripcion, fecha_accion
                    ) VALUES (
                        %(id_alerta)s, %(accion)s, %(usuario)s, %(descripcion)s, %(fecha_accion)s
                    )
                    """,
                    data,
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al insertar en la bitácora:", e)
            raise e

    def delete(self, id):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """ 
                    DELETE FROM bitacora WHERE id = %s
                    """,
                    (id,),
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al eliminar en la base de datos:", e)
            raise e

    def delete_all(self):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """ 
                    DELETE FROM bitacora;
                    ALTER SEQUENCE bitacora_id_seq RESTART WITH 1;
                    """
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al eliminar todas las entradas de bitácora:", e)
            raise e

    def __del__(self):
        if self.conn:
            self.conn.close()
