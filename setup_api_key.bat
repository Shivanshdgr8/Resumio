@echo off
setlocal
cd /d %~dp0

echo ========================================================
echo      Resumio API Key Setup
echo ========================================================
echo.
echo This application requires a Google Gemini API Key to work.
echo You can get one for free at: https://makersuite.google.com/app/apikey
echo.
set /p API_KEY="Enter your Gemini API Key: "

if "%API_KEY%"=="" (
    echo.
    echo No key entered. Exiting...
    pause
    exit /b
)

echo.
echo Updating backend/env.txt...

powershell -Command "$content = Get-Content 'backend/env.txt' -Raw; $newContent = $content -replace 'GEMINI_API_KEY=.*', 'GEMINI_API_KEY=%API_KEY%'; Set-Content 'backend/env.txt' $newContent"

echo.
echo Success! API Key has been updated.
echo You can now run 'start_all.bat' to launch the application.
echo.
pause
