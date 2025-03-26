@echo off
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Requesting administrative privileges...
    goto UACPrompt
) else ( goto gotAdmin )

:UACPrompt
    echo Set UAC = CreateObject^("Shell.Application"^) > "%temp%\getadmin.vbs"
    echo UAC.ShellExecute "%~s0", "", "", "runas", 1 >> "%temp%\getadmin.vbs"
    "%temp%\getadmin.vbs"
    exit /B

:gotAdmin
    if exist "%temp%\getadmin.vbs" ( del "%temp%\getadmin.vbs" )
    pushd "%CD%"
    CD /D "%~dp0"

echo Stopping Node.js processes...
taskkill /F /IM node.exe 2>nul

echo Cleaning Prisma files...

rem Delete Prisma cache and generated files
rd /s /q "%APPDATA%\Prisma" 2>nul
rd /s /q "node_modules\.prisma" 2>nul
rd /s /q "node_modules\@prisma" 2>nul
rd /s /q ".pnpm-store" 2>nul
rd /s /q "node_modules\.pnpm\@prisma+client*" 2>nul

rem Clean and reinstall dependencies
call pnpm install
call pnpm prisma generate

echo Done!
pause
