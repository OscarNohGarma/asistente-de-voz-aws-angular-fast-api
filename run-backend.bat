@echo off
echo Iniciando servicios...

:: Backend FastAPI
start cmd /k "cd backend\FastApi && call env\Scripts\activate.bat && uvicorn main:app --reload"

:: Frontend Angular
start cmd /k "cd frontend && call ng serve"

:: Modelo de IA
start cmd /k "call python .\watch_audio_reference.py"

echo Todo iniciado. Puedes cerrar esta ventana si quieres.
