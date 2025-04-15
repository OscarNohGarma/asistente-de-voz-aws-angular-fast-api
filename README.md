# 🧠 Sistema de Reconocimiento de Voz para Pacientes Geriátricos

Este proyecto tiene como objetivo asistir al personal médico en la atención de pacientes geriátricos mediante un sistema que reconoce palabras clave por voz y genera alertas automáticas. El sistema está dividido en tres módulos: frontend (Angular), backend (FastAPI) e inteligencia artificial (Whisper).

---

## 🏗️ Arquitectura General

- **Frontend**: Angular 16+
- **Backend**: FastAPI (Python)
- **Reconocimiento de Voz**: OpenAI Whisper + optimizaciones
- **Base de Datos**: ----
- **Notificaciones**: ---
- **Autenticación**: ---

---

## 🔑 Funcionalidades Clave

| Funcionalidad | Descripción |
|---------------|-------------|
| 🎤 Captura de voz | Captura continua de audio en tiempo real desde habitaciones |
| 🗣️ Detección de palabras | Palabras como “ayuda”, “código azul”, “auxilio” activan alertas |
| 🧍 Asociación por voz o ubicación | El sistema detecta qué paciente habló |
| 📣 Alerta automática | Notifica a enfermería y, en caso necesario, al médico y familiar |
| 🩺 Panel médico y enfermería | Monitorea solicitudes, historial y confirma acciones |
| 🔐 Login seguro por rol | Acceso diferenciado para médico, enfermero/a y administrador |
| 🧾 Bitácora digital | Registro completo de eventos, alertas y respuestas |
| 🧪 Pruebas de carga | Soporte para al menos 30 pacientes en tiempo real |

---

## 📁 Estructura del Proyecto

```
📦 asistente-de-voz-whisper-angular-fast-api/
├── frontend/          # Angular app (UI, login, paneles)
├── backend/           # FastAPI (API REST, lógica, DB, auth)
├── voice_ai/          # Whisper y scripts de detección
└── docs/              # Documentación, requerimientos y flujos
```

---

## 🚀 Instalación y ejecución local

### Requisitos

- Node.js 21+
- Python 3.10+

### 1. Clonar el repositorio

```bash
git clone https://github.com/tuusuario/voice-care-system.git
cd voice-care-system
```

### 2. Instalar dependencias

#### Frontend (Angular)
```bash
cd frontend
npm install
ng serve
```

#### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### AI (Reconocimiento de voz)
```bash
cd voice_ai
pip install -r requirements.txt
python start_listening.py
```

---

## 📦 Despliegue

- **Producción:** Se recomienda usar Docker para backend + frontend.
- **Servidor GPU:** Whisper debe correr en una máquina con soporte para CUDA (NVIDIA).

---

## 👥 Roles del Sistema

- **🧑‍⚕️ Médico:** Recibe notificaciones críticas y gestiona historial.
- **👩‍⚕️ Enfermero/a:** Monitorea alertas en tiempo real y confirma acciones.
- **🛠️ Administrador:** Configura reglas de respuesta y permisos de usuarios.

---

## 📈 Estado de Desarrollo

| Semana | Entregables principales |
|--------|-------------------------|
| 1      | Login, captura de voz y detección de palabras clave |
| 2      | Asociación con paciente y alertas visuales |
| 3      | Confirmaciones y notificaciones al médico |
| 4      | Bitácora digital y notificaciones a familiares |
| 5      | Historial de pacientes y módulo de administración |
| 6      | Pruebas, optimización y documentación final |

---

## 🧪 Pruebas

- Pruebas funcionales con 30 usuarios simultáneos.
- Simulaciones en ambientes ruidosos.
- Escenarios sin conexión a internet.

---

## 👨‍💻 Equipo de Desarrollo

- **Frontend**: [Oscar Iván Noh Garma], [Pedro Raúl Chi Ek]
- **Backend**: [Gildardo David Rubalcaba Cauich], [Ricardo Antonio Soto Beh]
- **IA**: [Carlos Daniel Quintal Pech], [Alan Antony Puc Yam]
- **Documentación y QA**: [Jesús Eduardo Huchin Yeh]

---

## 📄 Licencia

MIT © 2025 - Instituto Tecnológico Superior de Calkiní
