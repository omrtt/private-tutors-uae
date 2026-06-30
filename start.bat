@echo off
cd /d "%~dp0"

echo ========================================
echo  مدرّس.امارات - Private Tutors UAE
echo ========================================
echo.

cd backend
if not exist "..\frontend\dist\index.html" (
    echo Building frontend...
    cd ..\frontend
    call npm run build
    cd ..\backend
)

echo Starting server...
echo.
echo Open http://localhost:5000 in your browser
echo.
echo Login: student@test.ae / password123
echo.
node server.js
pause
