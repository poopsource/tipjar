@echo off
echo This script will attempt to automatically fix common issues that might prevent the project from running.
echo It will clean the npm cache, reinstall dependencies, and then try to start the project.
echo IMPORTANT: This script cannot fix all types of errors, especially code-related or complex configuration issues.

REM Change directory to the script's location (assumes the .bat file is in the project root)
cd /d "%~dp0"

echo.
echo --- Step 1: Cleaning npm cache --- 
call npm cache clean --force
if %errorlevel% neq 0 (
    echo Failed to clean npm cache.
    goto :eof
)
echo npm cache cleaned successfully.

echo.
echo --- Step 2: Removing old dependencies --- 
if exist package-lock.json (
    echo Deleting package-lock.json...
    del package-lock.json
)
if exist node_modules (
    echo Deleting node_modules directory (this might take a moment)...
    rd /s /q node_modules
)
echo Old dependency files removed.

echo.
echo --- Step 3: Reinstalling project dependencies --- 
echo This will use 'npm install --legacy-peer-deps'.
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies. Please check the error messages above.
    goto :error_exit
)
echo Dependencies reinstalled successfully.

echo.
echo --- Step 4: Attempting to fix known vulnerabilities (without forcing) --- 
call npm audit fix
if %errorlevel% neq 0 (
    echo 'npm audit fix' encountered issues or had nothing to fix, but continuing...
)

echo.
echo --- Step 5: Attempting to start the development server --- 
echo Trying to run 'npm run dev'...
call npm run dev

echo.
echo --- Script finished --- 
goto :eof

:error_exit
echo.
echo An error occurred. Please review the messages above.

:eof
REM Add a pause here if you want the command prompt window to stay open after completion or error.
REM pause
