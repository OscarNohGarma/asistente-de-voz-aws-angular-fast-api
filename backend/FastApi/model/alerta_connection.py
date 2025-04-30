import psycopg
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)


class AlertaConnection:
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
            cur.execute("SELECT * FROM alertas")
            return cur.fetchall()

    def read_one(self, id):
        with self.conn.cursor() as cur:
            cur.execute("SELECT * FROM alertas WHERE id = %s", (id,))
            return cur.fetchone()

    def write(self, data):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO alertas (
                        id_pacientes, tipo, hora, estado, confirmada_por,
                        fecha_confirmacion, nueva, palabras_clave
                    ) VALUES (
                        %(id_pacientes)s, %(tipo)s, %(hora)s, %(estado)s,
                        %(confirmada_por)s, %(fecha_confirmacion)s,
                        %(nueva)s, %(palabras_clave)s
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
                    UPDATE alertas
                    SET id_pacientes = %(id_pacientes)s,
                        tipo = %(tipo)s,
                        hora = %(hora)s,
                        estado = %(estado)s,
                        confirmada_por = %(confirmada_por)s,
                        fecha_confirmacion = %(fecha_confirmacion)s,
                        nueva = %(nueva)s,
                        palabras_clave = %(palabras_clave)s
                    WHERE id = %(id)s
                    """,
                    data,
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al actualizar en la base de datos:", e)
            raise e

    def delete_all(self):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """ 
                    DELETE FROM alertas;
                    ALTER SEQUENCE alertas_id_seq RESTART WITH 1;
                    """
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al eliminar todas las alertas en la base de datos:", e)
            raise e

    def __del__(self):
        if self.conn:
            self.conn.close()
