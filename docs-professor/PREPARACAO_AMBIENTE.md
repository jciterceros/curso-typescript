# Preparação do Ambiente - Curso TypeScript

Este documento explica como preparar o pendrive com todo o ambiente necessário para o curso.

---

## Estrutura de Pastas

Crie esta estrutura no pendrive:

```
D:\  (letra pode variar)
├── ambiente-portatil/
│   ├── nodejs/
│   ├── vscode/
│   ├── git/
│   ├── bruno/
│   └── cmder/
├── setup-ambiente.bat
├── restore-ambiente.bat
└── PREPARACAO_AMBIENTE.md
```

> **Importante:** Use uma letra de drive disponível (D:, E:, F:). Ajuste os scripts conforme necessário.

---

## 1. Baixar e Extrair as Ferramentas

### 1.1 Node.js

1. Acesse: https://nodejs.org/pt-br/download
2. Baixe: **"Windows Binary (.zip)"** (x64)
3. Extraia o conteúdo do `.zip` para `ambiente-portatil/nodejs/`
4. A pasta `nodejs` deve conter `node.exe` diretamente (não uma subpasta)

### 1.2 VS Code

1. Acesse: https://code.visualstudio.com/download
2. Baixe: **"Windows"** (zip, 64-bit)
3. Extraia para `ambiente-portatil/vscode/`
4. Ative modo portable: crie uma pasta vazia chamada `data` dentro de `vscode/`
   ```
   ambiente-portatil/vscode/data/
   ```

### 1.3 Git

1. Acesse: https://git-scm.com/download/win
2. Baixe: **"64-bit Git for Windows Portable"** (Thumbdrive Edition)
3. Extraia para `ambiente-portatil/git/`

### 1.4 Bruno (Client de API)

1. Acesse: https://www.usebruno.com/downloads
2. Baixe a versão **"Bruno for Windows"** (procurar por .zip ou standalone)
3. Extraia para `ambiente-portatil/bruno/`

### 1.5 Cmder (Terminal - Opcional)

1. Acesse: https://cmder.app/
2. Baixe a versão **"Mini"**
3. Extraia para `ambiente-portatil/cmder/`

---

## 2. Scripts de Configuração

### 2.1 setup-ambiente.bat

Crie este arquivo em `setup-ambiente.bat` na raiz do pendrive:

```batch
@echo off
chcp 65001 >nul
echo ========================================
echo   Configuracao do Ambiente - Curso TS
echo ========================================
echo.

:: Detectar letra do pendrive
set "DRIVE=%~d0"

:: Salvar PATH original
echo Salvando PATH original...
reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH > "%DRIVE%\backup_path.txt" 2>nul

:: Pegar PATH atual do sistema
for /f "tokens=2*" %%a in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH 2^>nul') do set "ORIGINAL_PATH=%%b"

:: Montar novo PATH
set "NEW_PATH=%ORIGINAL_PATH%"
set "NEW_PATH=%NEW_PATH%;%DRIVE%\ambiente-portatil\nodejs"
set "NEW_PATH=%NEW_PATH%;%DRIVE%\ambiente-portatil\git\cmd"
set "NEW_PATH=%NEW_PATH%;%DRIVE%\ambiente-portatil\git\bin"
set "NEW_PATH=%NEW_PATH%;%DRIVE%\ambiente-portatil\cmder\bin"

:: Aplicar novo PATH (permanente ate proximo boot ou ate restaurar)
echo Configurando PATH do sistema...
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH /t REG_EXPAND_SZ /d "%NEW_PATH%" /f >nul

echo.
echo ========================================
echo   CONFIGURADO COM SUCESSO!
echo ========================================
echo.
echo Abra um NOVO terminal (PowerShell ou CMD)
echo e teste com:
echo.
echo   node -v
echo   npm -v
echo   git --version
echo.
echo Apos a aula, execute: restore-ambiente.bat
echo.
pause
```

### 2.2 restore-ambiente.bat

Crie este arquivo em `restore-ambiente.bat` na raiz do pendrive:

```batch
@echo off
chcp 65001 >nul
echo ========================================
echo   Restaurando Ambiente Original
echo ========================================
echo.

:: Detectar letra do pendrive
set "DRIVE=%~d0"

:: Verificar se existe backup
if not exist "%DRIVE%\backup_path.txt" (
    echo ERRO: Backup nao encontrado!
    echo Execute setup-ambiente.bat primeiro.
    pause
    exit /b 1
)

:: Restaurar PATH original do backup
echo Restaurando PATH original...
for /f "tokens=2*" %%a in ('type "%DRIVE%\backup_path.txt"') do set "ORIGINAL_PATH=%%b"
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v PATH /t REG_EXPAND_SZ /d "%ORIGINAL_PATH%" /f >nul

echo.
echo ========================================
echo   AMBIENTE RESTAURADO!
echo ========================================
echo.
echo Reinicie o terminal para usar o PATH original.
echo.
pause
```

---

## 3. Como Usar em Cada Máquina

### Antes da Aula (Instrutor)

1. Insira o pendrive
2. Verifique a letra do drive (D:, E:, etc.)
3. Se a letra for diferente de D:, edite os scripts batch trocando `D:\` pela letra correta

### Em Cada Máquina (No Início)

1. Navegue até o pendrive
2. Execute `setup-ambiente.bat` **como Administrador**
3. Aguarde a mensagem de sucesso
4. **Abra um novo terminal** (PowerShell ou CMD)
5. Teste os comandos:
   ```powershell
   node -v
   npm -v
   git --version
   ```

Se o PowerShell bloquear `npm.ps1` por política de execução, abra o CMD ou use `npm.cmd`:

```powershell
npm.cmd -v
npm.cmd install
npm.cmd run dev
```

### Durante a Aula

- Execute `ambiente-portatil/vscode/Code.exe` para abrir o VS Code
- Execute `ambiente-portatil/bruno/Bruno.exe` para abrir o Bruno
- Execute `ambiente-portatil/cmder/Cmder.exe` se quiser usar o Cmder

### Após a Aula

1. Execute `restore-ambiente.bat` **como Administrador**
2. Aguarde confirmação

---

## 4. Checklist de Verificação

Antes de ir para a aula, verifique se tudo está no pendrive:

- [ ] Pasta `ambiente-portatil/nodejs/` com `node.exe`
- [ ] Pasta `ambiente-portatil/vscode/` com pasta `data/` vazia dentro
- [ ] Pasta `ambiente-portatil/git/` com conteúdo do Git
- [ ] Pasta `ambiente-portatil/bruno/` com Bruno
- [ ] Pasta `ambiente-portatil/cmder/` com Cmder (opcional)
- [ ] `setup-ambiente.bat` na raiz
- [ ] `restore-ambiente.bat` na raiz
- [ ] `PREPARACAO_AMBIENTE.md` na raiz
- [ ] Projeto do curso (zipado ou clone do repositório)

---

## 5. Testes Finais (Fazer em Casa)

Antes de ir para a aula, teste o pendrive na sua máquina:

1. Extraia o pendrive em uma VM ou computador de teste
2. Rode `setup-ambiente.bat`
3. Abra novo terminal e teste:
   ```powershell
   node -v
   npm -v
   git --version
   npx tsc --version
   ```
4. Abra o VS Code portable
5. Abra o Bruno
6. Ao final, rode `restore-ambiente.bat`

---

## 6. Pasta do Projeto

Coloque o projeto do curso no pendrive:

**Opção A:** Compactar o projeto em `.zip`

```
ambiente-portatil/projeto-curso.zip
```

**Opção B:** Clonar o repositório diretamente no pendrive

```
ambiente-portatil/curso-typescript/
```

Recomendação: **Opção A** (zip), pois clonar em pendrive pode ser lento.

---

## Resumo - Downloads

| Ferramenta | URL                                    | Arquivo               |
| ---------- | -------------------------------------- | --------------------- |
| Node.js    | https://nodejs.org/pt-br/download      | Windows Binary (.zip) |
| VS Code    | https://code.visualstudio.com/download | Windows .zip (64-bit) |
| Git        | https://git-scm.com/download/win       | Portable (Thumbdrive) |
| Bruno      | https://www.usebruno.com/downloads     | Windows standalone    |
| Cmder      | https://cmder.app/                     | Mini version          |
