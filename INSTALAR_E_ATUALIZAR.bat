@echo off
setlocal EnableExtensions EnableDelayedExpansion
chcp 65001 >nul
cd /d "%~dp0"
title JOGO DA VIVI - INSTALAR E ATUALIZAR

echo ============================================================
echo       JOGO DA VIVI V3 - INSTALAR / ATUALIZAR / ABRIR
echo ============================================================

echo [1/7] Verificando Git...
where git >nul 2>nul || (
  where winget >nul 2>nul || (echo [ERRO] Winget nao encontrado. Instale o App Installer da Microsoft Store.& pause & exit /b 1)
  winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
  set "PATH=%ProgramFiles%\Git\cmd;%PATH%"
)

echo [2/7] Verificando Node.js LTS...
where node >nul 2>nul || (
  winget install --id OpenJS.NodeJS.LTS -e --source winget --accept-source-agreements --accept-package-agreements
  set "PATH=%ProgramFiles%\nodejs;%PATH%"
)

echo [3/7] Sincronizando repositorio...
if not exist ".git" (
  echo Esta pasta ainda nao e um clone. Clonando o projeto para uma subpasta JOGO-DA-VIVI...
  git clone https://github.com/nestarasup-sys/JOGO-DA-VIVI.git JOGO-DA-VIVI
  cd /d JOGO-DA-VIVI
) else (
  git fetch --all --prune
  git checkout main
  git pull --ff-only origin main
)

echo [4/7] Instalando dependencias npm...
call npm install
if errorlevel 1 goto :fail

echo [5/7] Processando folhas de assets...
call npm run assets:slice
if errorlevel 1 echo [AVISO] Nenhuma folha nova ou pipeline de assets incompleto. Continuando.

echo [6/7] Validando e construindo V3...
call npm run check
if errorlevel 1 goto :fail

echo [7/7] Iniciando servidor local...
echo Abra http://localhost:5173 no navegador.
call npm run dev
exit /b 0
:fail
echo.
echo [ERRO] A instalacao/build falhou. Veja a mensagem acima.
pause
exit /b 1
