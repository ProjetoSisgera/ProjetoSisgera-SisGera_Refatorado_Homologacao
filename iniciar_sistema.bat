@echo off
TITLE SisGera - Iniciando Sistema
COLOR 0A
cd /d "%~dp0"

ECHO ==========================================
ECHO      INICIANDO SISGERA (DIAGNOSTICO)
ECHO ==========================================
ECHO.
ECHO Diretorio atual: %CD%
ECHO.

ECHO [1] Testando Node.js...
where node >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO [ERRO] O comando 'node' nao foi encontrado.
    ECHO O Node.js esta instalado e no PATH do sistema?
    ECHO Tente reiniciar o computador se acabou de instalar.
    PAUSE
    EXIT
)
node -v
ECHO Node OK!
ECHO.

ECHO [2] Testando NPM...
where npm >nul 2>nul
IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO [ERRO] O comando 'npm' nao foi encontrado.
    PAUSE
    EXIT
)
call npm -v
ECHO NPM OK!
ECHO.

ECHO [3] Verificando dependencias (node_modules)...
IF NOT EXIST "node_modules" (
    ECHO Pasta node_modules nao encontrada. Instalando...
    call npm install
    IF %ERRORLEVEL% NEQ 0 (
        COLOR 0C
        ECHO [ERRO] Falha ao instalar dependencias.
        PAUSE
        EXIT
    )
) ELSE (
    ECHO Dependencias ja existem.
)
ECHO.

ECHO [4] Iniciando Servidor de Desenvolvimento...
ECHO.
ECHO Pressione qualquer tecla para rodar 'npm start'...
PAUSE
call npm start

IF %ERRORLEVEL% NEQ 0 (
    COLOR 0C
    ECHO.
    ECHO [ERRO] O servidor parou com codigo de erro %ERRORLEVEL%.
    PAUSE
)
