@echo off
setlocal
cd /d "%~dp0"
title Epoch AI concept - localhost
set "LOG=%~dp0start-log.txt"
echo Started %date% %time% > "%LOG%"

where node >nul 2>nul
if errorlevel 1 (
  echo RESULT: Node.js not found >> "%LOG%"
  echo.
  echo Node.js is not installed on this computer. The website cannot start without it.
  echo.
  choice /m "Install Node.js now"
  if errorlevel 2 (
    echo You can install it yourself from https://nodejs.org then run this file again.
    pause
    exit /b 1
  )
  winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
  echo winget exit code %errorlevel% >> "%LOG%"
  echo.
  echo When the install has finished, CLOSE this window and double-click START-WEBSITE.bat again.
  pause
  exit /b 0
)
node -v >> "%LOG%" 2>&1

where python >nul 2>nul
if errorlevel 1 (
  echo Python not found, API skipped >> "%LOG%"
  echo Python was not found. The website will still run, but the newsletter form will not submit.
) else (
  echo Starting the Python API on http://localhost:8000 ...
  python -m pip install -q -r api\requirements.txt >> "%LOG%" 2>&1
  start "Epoch concept API" /min /d "%~dp0server" python -m uvicorn main:app --port 8000
)

if not exist node_modules\next (
  echo Installing website packages. First run only, this can take several minutes. Please wait...
  call npm install >> "%LOG%" 2>&1
  if errorlevel 1 (
    echo RESULT: npm install failed >> "%LOG%"
    echo Package install failed. Check your internet connection and run this file again.
    pause
    exit /b 1
  )
)
echo RESULT: starting dev server >> "%LOG%"

echo.
echo Website starting at http://localhost:3000
echo Keep this window open. Press Ctrl+C to stop.
echo.
start "" /min cmd /c "timeout /t 12 /nobreak >nul & start http://localhost:3000"
call npm run dev
echo RESULT: dev server exited with code %errorlevel% >> "%LOG%"
pause
