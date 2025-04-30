#!/bin/bash

echo "==================================================="
echo "Instalando dependencias para Tailwind CSS y PostCSS"
echo "==================================================="

echo
echo "Verificando la instalación de Node.js..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado o no está en el PATH."
    echo "Por favor, instala Node.js desde https://nodejs.org/"
    echo "o usa tu gestor de paquetes (apt, brew, etc.) para instalarlo."
    echo "Luego reinicia este script."
    exit 1
fi

echo
echo "Verificando la instalación de npm..."
if ! command -v npm &> /dev/null; then
    echo "ERROR: npm no está instalado o no está en el PATH."
    echo "Por favor, reinstala Node.js desde https://nodejs.org/"
    echo "o usa tu gestor de paquetes (apt, brew, etc.) para instalarlo."
    echo "Asegúrate de que npm esté incluido en la instalación."
    exit 1
fi

echo
echo "Versión de Node.js:"
node --version

echo
echo "Versión de npm:"
npm --version

echo
echo "1. Instalando @tailwindcss/postcss..."
if ! npm install @tailwindcss/postcss --save-dev; then
    echo "ERROR: No se pudo instalar @tailwindcss/postcss."
    exit 1
fi

echo
echo "2. Actualizando versiones de Tailwind CSS y PostCSS..."
if ! npm install tailwindcss@^3.3.5 postcss@^8.4.31 autoprefixer@^10.4.16 --save-dev; then
    echo "ERROR: No se pudieron actualizar las dependencias."
    exit 1
fi

echo
echo "3. Limpiando la caché de npm..."
if ! npm cache clean --force; then
    echo "ADVERTENCIA: No se pudo limpiar la caché de npm."
    echo "Continuando con la instalación..."
fi

echo
echo "4. Reinstalando todas las dependencias..."
if ! npm install; then
    echo "ERROR: No se pudieron reinstalar las dependencias."
    exit 1
fi

echo
echo "5. Probando la compilación..."
if ! npm run build; then
    echo "ERROR: La compilación falló."
    echo "Por favor, consulta el archivo TAILWIND_POSTCSS_FIX.md para más información."
    exit 1
fi

echo
echo "==================================================="
echo "Instalación completada exitosamente"
echo "==================================================="
echo
echo "La compilación fue exitosa. El problema está resuelto."
echo
