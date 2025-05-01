@echo off
cd backend\FastApi
call env\Scripts\activate.bat
uvicorn main:app --reload
