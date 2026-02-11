@echo off
title Resumio Launcher
echo Starting Resumio Full Stack Environment...
echo.

echo Launching Backend...
start "Resumio Backend" cmd /k "cd backend && run.bat"

echo Launching Frontend...
start "Resumio Frontend" cmd /k "cd frontend && run.bat"

echo.
echo ========================================================
echo  Services are starting in separate windows.
echo  Please wait for both to initialize.
echo.
echo  Backend: http://localhost:8000/docs
echo  Frontend: http://localhost:5173
echo ========================================================
echo.
pause
