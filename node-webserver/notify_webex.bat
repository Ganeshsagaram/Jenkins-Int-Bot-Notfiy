@echo off
setlocal

REM Set your Webex credentials
set WEBEX_TOKEN="Bearer <Token>"
set ROOM_ID="ROOM_ID"

REM Jenkins variables (available in freestyle jobs)
set JOB_NAME=%JOB_NAME%
set BUILD_NUMBER=%BUILD_NUMBER%
set BUILD_STATUS=SUCCESS

REM Send Webex message
curl -X POST https://webexapis.com/v1/messages -H "Authorization: Bearer %WEBEX_TOKEN%" -H "Content-Type: application/json" -d "{\"roomId\": \"%ROOM_ID%\", \"text\": \"✅ Jenkins Job: %JOB_NAME% #%BUILD_NUMBER% finished with status: %BUILD_STATUS%\"}"

endlocal
