@echo off
setlocal

REM Set your Webex credentials
set WEBEX_TOKEN="Bearer ZjkyYzczM2YtYjM2ZS00OWRjLTgyYTktNWEwYjdjMjJjNThhZWQ4MTIyY2UtM2Fj_P0A1_719e5834-e6ce-4718-b3d0-7b6ed355fd8e"
set ROOM_ID="Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL1JPT00vMzFmNDY1ZDAtMzYxYy0xMWYwLWE2NzYtZjEwZmVlYTA5NTMz"

REM Jenkins variables (available in freestyle jobs)
set JOB_NAME=%JOB_NAME%
set BUILD_NUMBER=%BUILD_NUMBER%
set BUILD_STATUS=SUCCESS

REM Send Webex message
curl -X POST https://webexapis.com/v1/messages -H "Authorization: Bearer %WEBEX_TOKEN%" -H "Content-Type: application/json" -d "{\"roomId\": \"%ROOM_ID%\", \"text\": \"✅ Jenkins Job: %JOB_NAME% #%BUILD_NUMBER% finished with status: %BUILD_STATUS%\"}"

endlocal
