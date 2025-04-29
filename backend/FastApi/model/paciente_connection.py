import psycopg


class PacienteConnection:
    def __init__(self):
        self.conn = None
        try:
            self.conn = psycopg.connect(
                "dbname=fast_api user=postgres password=n20pyali host=localhost port=5432"
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
                SELECT * FROM pacientes
                """
            )
            return cur.fetchall()

    def read_one(self, id):
        with self.conn.cursor() as cur:
            cur.execute(
                """ 
                SELECT * FROM pacientes WHERE id = %s
                """,
                (id,),
            )
            return cur.fetchone()

    def write(self, data):
        try:
            with self.conn.cursor() as cur:
                cur.execute(
                    """ 
                    INSERT INTO pacientes (
                        nombre_completo, foto_url, edad, habitacion, diagnostico, fecha_ingreso, activo
                    ) VALUES (
                        %(nombre_completo)s, %(foto_url)s, %(edad)s, %(habitacion)s,
                        %(diagnostico)s, %(fecha_ingreso)s, %(activo)s,
                        %(telefono_familiar)s, %(correo_familiar)s
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
                    UPDATE pacientes
                    SET nombre_completo = %(nombre_completo)s,
                        foto_url = %(foto_url)s,
                        edad = %(edad)s,
                        habitacion = %(habitacion)s,
                        diagnostico = %(diagnostico)s,
                        fecha_ingreso = %(fecha_ingreso)s,
                        activo = %(activo)s,
                        telefono_familiar = %(telefono_familiar)s,
                        correo_familiar = %(correo_familiar)s
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
                    DELETE FROM pacientes WHERE id = %s
                    
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
                    DELETE FROM pacientes;
                    ALTER SEQUENCE pacientes_id_seq RESTART WITH 1;
                    """
                )
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print("Error al eliminar todos los pacientes en la base de datos:", e)
            raise e

    def __del__(self):
        if self.conn:
            self.conn.close()
