const obj={
  "id": "Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL0FUVEFDSE1FTlRfQUNUSU9OLzdkYjdkYzEwLTQ2MWUtMTFmMC1hZGViLTQ1MWM5NmRmZWI2ZQ",
  "type": "submit",
  "messageId": "Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL01FU1NBR0UvNjRiNmNjMzAtNDYxZS0xMWYwLTk2NTQtZjc2NGExNWFkMTk2",
  "inputs": {
    "action": "runJenkinsOperation",
    "buildNumber": "",
    "environment": "get-job-info",
    "jobName": "Hello-world"
  },
  "personId": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS8xYzViMTgwZi1lNTgxLTQ2OTctOTg1Mi03MGU3NWMzYjAxMjU",
  "roomId": "Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL1JPT00vMzFmNDY1ZDAtMzYxYy0xMWYwLWE2NzYtZjEwZmVlYTA5NTMz",
  "created": "2025-06-10T17:15:22.065Z"
}

const {action,buidNumber,environment,jobName}=obj.inputs

console.log(action)

console.log(env==="get-job-info")

