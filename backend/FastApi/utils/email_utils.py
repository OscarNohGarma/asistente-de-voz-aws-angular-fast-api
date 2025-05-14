# app/utils/email_utils.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
load_dotenv(dotenv_path)

EMAIL_ORIGEN = os.getenv("EMAIL_ORIGEN")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


def enviar_correo(destinatario: str, asunto: str, cuerpo: str):
    mensaje = MIMEMultipart()
    mensaje["From"] = EMAIL_ORIGEN
    mensaje["To"] = destinatario
    mensaje["Subject"] = asunto
    mensaje.attach(MIMEText(cuerpo, "plain"))

    try:
        servidor = smtplib.SMTP("smtp.gmail.com", 587)
        servidor.starttls()
        servidor.login(EMAIL_ORIGEN, EMAIL_PASSWORD)
        servidor.send_message(mensaje)
        servidor.quit()
        return True
    except Exception as e:
        print("❌ Error al enviar correo:", e)
        return False
