@echo off
echo ===================================================
echo   Starting TalentTrade Platform (Backend + Frontend)
echo ===================================================

echo Starting Backend Server on http://localhost:3000...
start "TalentTrade Backend (Port 3000)" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server on http://localhost:5173...
start "TalentTrade Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ===================================================
echo   TalentTrade is running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3000
echo ===================================================
