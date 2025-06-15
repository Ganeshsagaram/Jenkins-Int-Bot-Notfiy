//import { parse } from "dotenv";

const cronExpr = "0 11 * * *";

const [minute, hour, dayOfMonth, month, dayOfWeek]=cronExpr.split(" ");

const hr=parseInt(hour)
const min = parseInt(minute);
const am_or_pm=(hr>=12)?"PM":"AM";
const displayHour = hr % 12 === 0 ? 12 : hr % 12;
const displayMin = min.toString().padStart(2, '0');
let date=""
if(dayOfMonth==="*"&&month==="*"&&dayOfWeek==="*"){
    date="Every Day"
}
else{
    date=`on ${dayOfMonth}/${month} (weekday ${dayOfWeek})`;
}

const time=`${displayHour}:${displayMin} ${am_or_pm}`;
const message = `Your Next Build is Scheduled at ${time} UTC on ${date}`;

console.log(message)
