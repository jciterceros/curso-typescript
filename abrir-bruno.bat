@echo off
setlocal

set "ROOT=%~dp0"
set "NODE_HOME=%ROOT%tools\node-v24.15.0-win-x64"
set "BRUNO_EXE=%ROOT%tools\bruno\Bruno.exe"
set "BRUNO_USER_DATA=%ROOT%tools\bruno-data"
set "BRUNO_COLLECTIONS=%ROOT%bruno"

if not exist "%BRUNO_EXE%" (
  echo Bruno portatil nao encontrado em:
  echo %BRUNO_EXE%
  pause
  exit /b 1
)

if not exist "%NODE_HOME%\node.exe" (
  echo Node portatil nao encontrado em:
  echo %NODE_HOME%
  pause
  exit /b 1
)

if not exist "%BRUNO_USER_DATA%" mkdir "%BRUNO_USER_DATA%"
if not exist "%BRUNO_COLLECTIONS%" mkdir "%BRUNO_COLLECTIONS%"

"%NODE_HOME%\node.exe" -e "const fs=require('fs');const path=require('path');const root=path.resolve(process.argv[1]);const data=path.join(root,'tools','bruno-data');const collections=path.join(root,'bruno');fs.mkdirSync(data,{recursive:true});fs.mkdirSync(collections,{recursive:true});const file=path.join(data,'preferences.json');let prefs={preferences:{}};if(fs.existsSync(file)){try{prefs=JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){}}prefs.preferences=prefs.preferences||{};prefs.preferences.general=prefs.preferences.general||{};prefs.preferences.general.defaultLocation=collections;prefs.preferences.general.defaultWorkspacePath='';fs.writeFileSync(file,JSON.stringify(prefs,null,2));" "%ROOT%."

set "PATH=%NODE_HOME%;%NODE_HOME%\node_modules\npm\bin;%PATH%"
start "" "%BRUNO_EXE%" --user-data-dir="%BRUNO_USER_DATA%"
