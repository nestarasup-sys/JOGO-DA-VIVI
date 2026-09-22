@echo off
setlocal
title Entre Nos Aurora V3 Ultra
cd /d "%~dp0"
if not exist node_modules (
  echo Dependencias ausentes. Rodando instalacao...
  call npm install --no-audit --no-fund || exit /b 1
)
call npm run validate:story || exit /b 1
call npm run dev
