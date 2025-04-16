@echo off
echo Implementando en Firebase Hosting...

REM Establecer la ruta de Node.js
set PATH=%PATH%;C:\Program Files\nodejs

REM Limpiar la carpeta dist
if exist dist rmdir /s /q dist

REM Limpiar la caché de npm
call npm cache clean --force

REM Construir la aplicación
call npm run build

REM Implementar en Firebase Hosting
call firebase deploy --only hosting

echo Implementación completada.
pause
