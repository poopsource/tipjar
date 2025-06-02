@echo off
REM Change directory to the script's location
cd /d "%~dp0"

echo Installing project dependencies...
call npm install --legacy-peer-deps

echo Starting the development server...
call npm run dev

REM You can add a pause here if you want the window to stay open after the dev server stops or fails
REM pause