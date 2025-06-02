@echo off
REM Change directory to the script's location (assumes the .bat file is in the project root)
cd /d "%~dp0"

echo --- Staging all changes --- 
call git add .

echo.
echo --- Committing changes --- 
REM You can customize the commit message below
set COMMIT_MESSAGE=Automated commit by batch script - %date% %time%
call git commit -m "%COMMIT_MESSAGE%"
if %errorlevel% neq 0 (
    echo INFO: 'git commit' failed. This might be because there are no changes to commit, or an actual error occurred.
    echo Continuing to attempt push...
)

echo.
echo --- Determining current branch --- 
FOR /F "tokens=*" %%g IN ('git rev-parse --abbrev-ref HEAD') DO (SET CURRENT_BRANCH=%%g)
if not defined CURRENT_BRANCH (
    echo ERROR: Could not determine current Git branch.
    goto :error_exit
)
echo Current branch is: %CURRENT_BRANCH%

echo.
echo --- Pushing changes to origin/%CURRENT_BRANCH% --- 
call git push origin %CURRENT_BRANCH%
if %errorlevel% neq 0 (
    echo ERROR: 'git push' failed. Check for errors above. You might need to pull changes, resolve conflicts, or check authentication.
    goto :error_exit
)

echo.
echo --- GitHub repository update attempted successfully! --- 
goto :eof

:error_exit
echo.
echo An error occurred. Please review the messages above.

:eof
REM Add a pause here if you want the command prompt window to stay open after completion or error.
REM pause
