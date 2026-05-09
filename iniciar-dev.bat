@echo off
setlocal

set "ROOT=%~dp0"
set "NODE_HOME=%ROOT%tools\node-v24.15.0-win-x64"

if not exist "%NODE_HOME%\node.exe" (
  echo Node portatil nao encontrado em:
  echo %NODE_HOME%
  pause
  exit /b 1
)

set "PATH=%NODE_HOME%;%NODE_HOME%\node_modules\npm\bin;%PATH%"
cd /d "%ROOT%"

npm run dev
pause
