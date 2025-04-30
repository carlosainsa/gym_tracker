@echo off
echo ===================================================
echo Solucionando problema de Tailwind CSS y PostCSS
echo ===================================================

echo.
echo 1. Desinstalando versiones antiguas...
call npm uninstall tailwindcss postcss autoprefixer @tailwindcss/postcss @tailwindcss/postcss7-compat

echo.
echo 2. Instalando versiones compatibles...
call npm install -D tailwindcss@latest postcss@latest autoprefixer@latest

echo.
echo 3. Probando la compilación...
call npm run build

echo.
echo ===================================================
echo Proceso completado
echo ===================================================
echo.
echo Si la compilación fue exitosa, el problema está resuelto.
echo Si sigues teniendo problemas, intenta ejecutar:
echo npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
echo.
pause
