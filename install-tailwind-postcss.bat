@echo off
echo ===================================================
echo Instalando dependencias para Tailwind CSS y PostCSS
echo ===================================================

echo.
echo Verificando la instalación de Node.js...
where node
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js no está instalado o no está en el PATH.
    echo Por favor, instala Node.js desde https://nodejs.org/
    echo y reinicia este script.
    pause
    exit /b 1
)

echo.
echo Verificando la instalación de npm...
where npm
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm no está instalado o no está en el PATH.
    echo Por favor, reinstala Node.js desde https://nodejs.org/
    echo y asegúrate de que npm esté incluido en la instalación.
    pause
    exit /b 1
)

echo.
echo Versión de Node.js:
node --version

echo.
echo Versión de npm:
npm --version

echo.
echo 1. Instalando @tailwindcss/postcss...
call npm install @tailwindcss/postcss --save-dev
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: No se pudo instalar @tailwindcss/postcss.
    pause
    exit /b 1
)

echo.
echo 2. Actualizando versiones de Tailwind CSS y PostCSS...
call npm install tailwindcss@^3.3.5 postcss@^8.4.31 autoprefixer@^10.4.16 --save-dev
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: No se pudieron actualizar las dependencias.
    pause
    exit /b 1
)

echo.
echo 3. Limpiando la caché de npm...
call npm cache clean --force
if %ERRORLEVEL% NEQ 0 (
    echo ADVERTENCIA: No se pudo limpiar la caché de npm.
    echo Continuando con la instalación...
)

echo.
echo 4. Reinstalando todas las dependencias...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: No se pudieron reinstalar las dependencias.
    pause
    exit /b 1
)

echo.
echo 5. Probando la compilación...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: La compilación falló.
    echo Por favor, consulta el archivo TAILWIND_POSTCSS_FIX.md para más información.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo Instalación completada exitosamente
echo ===================================================
echo.
echo La compilación fue exitosa. El problema está resuelto.
echo.
pause
