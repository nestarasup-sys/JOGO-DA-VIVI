@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Entre Nos Aurora V3 Ultra - Setup Update Run
color 0D

echo ============================================================
echo          ENTRE NOS: AURORA - V3 ULTRA
echo          SETUP + UPDATE + DEPENDENCIAS + RUN
echo ============================================================
echo.

set "ROOT=%~dp0"
set "REPO_URL=https://github.com/nestarasup-sys/JOGO-DA-VIVI.git"
set "PROJECT=%ROOT%JOGO-DA-VIVI"

where winget >nul 2>nul
if errorlevel 1 (
  echo [ERRO] winget nao foi encontrado.
  echo Instale "App Installer" pela Microsoft Store e rode este BAT novamente.
  pause
  exit /b 1
)

call :ensure git "Git.Git" "Git"
call :ensure node "OpenJS.NodeJS.LTS" "Node.js LTS"
call :ensure python "Python.Python.3.13" "Python 3"

set "PATH=%PATH%;C:\Program Files\Git\cmd;C:\Program Files\nodejs;%LocalAppData%\Programs\Python\Python313;%LocalAppData%\Programs\Python\Python313\Scripts"

where git >nul 2>nul || goto :restart_needed
where node >nul 2>nul || goto :restart_needed
where npm >nul 2>nul || goto :restart_needed
where python >nul 2>nul || goto :restart_needed

if exist "%ROOT%.git" (
  set "PROJECT=%ROOT%"
) else if exist "%PROJECT%\.git" (
  rem projeto ja clonado
) else (
  echo.
  echo [GIT] Clonando repositorio oficial...
  git clone "%REPO_URL%" "%PROJECT%" || goto :fail
)

cd /d "%PROJECT%" || goto :fail

echo.
echo [GIT] Atualizando main...
git fetch --all --prune || goto :fail
git checkout main || goto :fail
git pull --ff-only origin main || goto :fail
git lfs install >nul 2>nul

echo.
echo [NPM] Instalando/atualizando dependencias...
call npm install --no-audit --no-fund || goto :fail

echo.
echo [PYTHON] Instalando ferramentas de assets...
python -m pip install --upgrade pip
python -m pip install -r tools\requirements.txt || goto :fail

echo.
echo [CHECK] Validando historia e compilando V3...
call npm run check || goto :fail

echo.
echo ============================================================
echo [OK] AURORA V3 ESTA ATUALIZADO E COMPILADO.
echo ============================================================
echo.
echo Abrindo servidor de desenvolvimento...
echo URL local normalmente: http://localhost:5173
echo Pressione CTRL+C nesta janela para encerrar.
echo.
call npm run dev
exit /b 0

:ensure
where %~1 >nul 2>nul
if not errorlevel 1 exit /b 0
echo [SETUP] Instalando %~3...
winget install --id %~2 -e --accept-package-agreements --accept-source-agreements --silent
exit /b 0

:restart_needed
echo.
echo [AVISO] Um aplicativo foi instalado, mas o Windows ainda nao atualizou o PATH.
echo Feche este BAT e abra novamente. Na segunda execucao ele continua automaticamente.
pause
exit /b 2

:fail
echo.
echo [ERRO] Alguma etapa falhou. Leia a mensagem acima.
pause
exit /b 1
