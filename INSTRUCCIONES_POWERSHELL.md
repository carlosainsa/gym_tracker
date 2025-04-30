# Instrucciones para ejecutar scripts en PowerShell

Si estás usando PowerShell y encuentras problemas al ejecutar los scripts de instalación, sigue estas instrucciones:

## Problema: El script no se reconoce como un comando

Si ves un error como este:

```
install-tailwind-postcss.bat : El término 'install-tailwind-postcss.bat' no se reconoce como nombre de un cmdlet, función, archivo de script o programa ejecutable.
```

### Solución 1: Ejecutar con ruta explícita

En PowerShell, debes especificar la ruta explícita al script, incluso si estás en el mismo directorio:

```powershell
.\install-tailwind-postcss.bat
```

### Solución 2: Ejecutar con cmd

Otra opción es usar cmd.exe para ejecutar el script:

```powershell
cmd /c install-tailwind-postcss.bat
```

## Problema: Políticas de ejecución de PowerShell

Si encuentras problemas relacionados con las políticas de ejecución de PowerShell, puedes cambiar temporalmente la política de ejecución:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Luego ejecuta el script:

```powershell
.\install-tailwind-postcss.bat
```

## Problema: Node.js no está instalado o no está en el PATH

Si el script indica que Node.js no está instalado o no está en el PATH:

1. Descarga e instala Node.js desde [nodejs.org](https://nodejs.org/)
2. Reinicia PowerShell o tu terminal
3. Verifica que Node.js esté instalado correctamente:

```powershell
node --version
npm --version
```

4. Ejecuta el script nuevamente:

```powershell
.\install-tailwind-postcss.bat
```

## Instalación manual

Si sigues teniendo problemas con los scripts, puedes seguir las instrucciones manuales en el archivo `TAILWIND_POSTCSS_FIX.md`:

```powershell
# 1. Instalar el paquete @tailwindcss/postcss
npm install @tailwindcss/postcss --save-dev

# 2. Actualizar las versiones de Tailwind CSS y PostCSS
npm install tailwindcss@^3.3.5 postcss@^8.4.31 autoprefixer@^10.4.16 --save-dev

# 3. Limpiar la caché de npm
npm cache clean --force

# 4. Reinstalar todas las dependencias
npm install

# 5. Probar la compilación
npm run build
```
