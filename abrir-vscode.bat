@echo off
setlocal

set "ROOT=%~dp0"
set "NODE_HOME=%ROOT%tools\node-v24.15.0-win-x64"
set "VSCODE_EXE=%ROOT%tools\vscode\Code.exe"
set "VSCODE_USER_DATA=%ROOT%tools\vscode\data"
set "VSCODE_EXTENSIONS=%ROOT%tools\vscode\extensions"

if not exist "%VSCODE_EXE%" (
  echo VS Code portatil nao encontrado em:
  echo %VSCODE_EXE%
  pause
  exit /b 1
)

if not exist "%NODE_HOME%\node.exe" (
  echo Node portatil nao encontrado em:
  echo %NODE_HOME%
  pause
  exit /b 1
)

set "PATH=%NODE_HOME%;%NODE_HOME%\node_modules\npm\bin;%PATH%"

if not exist "%VSCODE_USER_DATA%" mkdir "%VSCODE_USER_DATA%"
if not exist "%VSCODE_EXTENSIONS%" mkdir "%VSCODE_EXTENSIONS%"

start "" "%VSCODE_EXE%" --user-data-dir "%VSCODE_USER_DATA%" --extensions-dir "%VSCODE_EXTENSIONS%" "%ROOT%"
