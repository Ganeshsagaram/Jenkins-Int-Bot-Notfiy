import axios, { all } from "axios";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import xml2js from "xml2js";
import { parseString } from "xml2js";
// import jobConfig from "../All-JSON-Files/Hello-world_config.json" assert { type: 'json' };
import { time } from "console";
import { type } from "os";
import { parse } from "path";
//import { json } from "body-parser";
const username = process.env.USERNAME;
const apiToken = process.env.JENKINS_API_TOKEN;
const CRUMB_TOKEN=process.env.CRUMB
const parser = new xml2js.Parser();
const auth = Buffer.from(`${username}:${apiToken}`).toString('base64');
// console.log(auth)
// console.log(jobConfig);
function get_date_time_in_local(UNIXTIME) {
    const timestamp = UNIXTIME;

    const date = new Date(timestamp);

    // Convert to IST
    const istTime = date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    return istTime;

}

function my_next_job_build_details(jsonOutput) {
    const parsedJSONOutput=JSON.parse(jsonOutput);
    // console.log((parsedJSONOutput.project))
    let time_details = parsedJSONOutput.project.triggers[0]['hudson.triggers.TimerTrigger'][0].spec;
    

    if (time_details !== undefined || time_details !== null) {
        const cronExpr = time_details[0];

        const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpr.split(" ");

        const hr = parseInt(hour)
        const min = parseInt(minute);
        const am_or_pm = (hr >= 12) ? "PM" : "AM";
        const displayHour = hr % 12 === 0 ? 12 : hr % 12;
        const displayMin = min.toString().padStart(2, '0');
        let date = ""
        if (dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
            date = "Every Day"
        }
        else {
            date = `on ${dayOfMonth}/${month} (weekday ${dayOfWeek})`;
        }

        const time = `${displayHour}:${displayMin} ${am_or_pm}`;
        const message = `Your Next Build is Scheduled at ${time} on ${date}`;
        return message;
        console.log(message)
    }
    console.log(time_details[0])
}

//All information about Jenkins Job query must be "Job Name"
export const jenkinsJobDetails = async (jobName) => {

    try {
        const req = await axios.get(`http://localhost:8080/job/${jobName}/api/json`,
            {
                headers: {
                    'Accept': 'application/xml',
                    'Authorization': "Basic " + auth
                }
            }
              
        );
        if (req.status === 200) {
            console.log("success from jenkinsJobDetails");
            const data = req.data;
            const jsonString = JSON.stringify(data, null, 2);
            //const job_file_name = jobName + "_details.json";
            return jsonString
        } else {
            
            console.error("Failed to fetch job details, status code:", req.status);
            return `Error status code ${req.status}`
        }

    }
    catch (err) {
       
        console.error(err);
        return "Error no connection to jenkins maybe";
    }
}

// about particular build number and filter out req details
export const getJenkinsBuildNumDetails = async (jobName, buildNumber) => {
    try {
        const response = await axios.get(`http://localhost:8080/job/${jobName}/${buildNumber}/api/json`,
            {
                headers: {
                    'Accept': 'application/xml',
                    'Authorization': "Basic " + auth
                }
            }
        );
        if (response.status === 200) {
            console.log("success from getJenkinsBuildNumDetails");
            const data = response.data;
            const reponse_obj_details = {
                BuildNumber: data.id,
                URL: data.url,
                time: get_date_time_in_local(data.timestamp),
                Result: data.result,
                Running: data.inProgress
            }
            console.log(JSON.stringify(reponse_obj_details,null,2));
            return JSON.stringify(reponse_obj_details,null,2)
        }
        else {
            return `after axios request error occured, ${response.status}`
            //console.log("error after the axios request", response.status);
        }
    }
    catch (err) {
        return "No connection is established to Jenkins on our machine";
        //console.error("Error fetching build details:", err);
    }
}

//get your configuration details in detail in XML format
export let getJenkinsJobConfiguration = async (jobName, getNextBuildSchedule = 0) => {
    try {
      const response = await axios.get(`http://localhost:8080/job/${jobName}/config.xml`, {
        headers: {
          'Accept': 'application/xml',
          'Authorization': "Basic " + auth
        }
      });
  
      if (response.status === 200) {
        console.log("success from getJenkinsJobConfiguration");
  
        const xmlData = response.data;
  
        // Wrap the parser in a promise
        const parsedJson = await new Promise((resolve, reject) => {
          parseString(xmlData, (err, result) => {
            if (err) {
              reject('Failed to parse XML: ' + err);
            } else {
              resolve(result);
            }
          });
        });
  
        const jsonOutput = JSON.stringify(parsedJson, null, 2);
  
        if (getNextBuildSchedule) {
          const buildTime = my_next_job_build_details(jsonOutput);
          console.log(buildTime);
          return buildTime;
        } else {
          console.log(jsonOutput);
          return jsonOutput;
        }
  
      } else {
        console.log("error after the axios request", response.status);
        return `after axios request error occurred, ${response.status}`;
      }
  
    } catch (err) {
      console.log("Error fetching job configuration:", err);
      return "No connection is established to Jenkins on our machine";
    }
  };

//get latest job builds hardcode to only 5

export const getLastFiveBuildsDetails = async (jobName) => {


    try {
        const response = await axios.get(`http://localhost:8080/job/${jobName}/api/json?tree=builds[number,result,timestamp]{0,5}`,
            {
                headers: {
                    'Accept': 'application/xml',
                    'Authorization': "Basic " + auth
                }
            }
        );
        if (response.status === 200) {
            console.log("success from getLast Builds");
            const data = response.data;
            // console.log(data);
            const filteredData = data.builds.map((eachData) => {
                const object = {
                    buildNumber: eachData.number,
                    result: eachData.result,
                    time: get_date_time_in_local(eachData.timestamp)
                }
                return object
            });
            console.log(filteredData);
            return JSON.stringify(filteredData,null,2);
            
        }
        else {
           console.log("error after the axios request", response.status);
           return `after axios request error occured, ${response.status}`
        
        }
    } catch (err) {
        console.log("Error fetching job configuration:", err);
        return "Error fetching job configuration:";
        
    }
}

export const getLastSuccessfulBuiltJob = async (jobName) => {
    try {
        const response = await axios.get(`http://localhost:8080/job/${jobName}/lastSuccessfulBuild/api/json`,
            {
                headers: {
                    'Accept': 'application/xml',
                    'Authorization': "Basic " + auth
                }
            }
        );
        if (response.status === 200) {
            console.log("success from getLastSuccessfulBuiltJob");
            const data = response.data;
            const last_success_job_build = {
                BuildNumber: data.id,
                URL: data.url,
                time: get_date_time_in_local(data.timestamp)
            }
            console.log(last_success_job_build);
            return JSON.stringify(last_success_job_build,null,2)
        }
        else {
            console.log("error after the axios request", response.status);
            return `after axios request error occured, ${response.status}`
            
            
        }
    }
    catch (err) {
        console.error("Error fetching build details:", err);
        return "No connection is established to Jenkins on our machine";
        
    }
}

export const getLastFailureBuild = async (jobName) => {
    try {
        const response = await axios.get(`http://localhost:8080/job/${jobName}/lastFailedBuild/api/json`,
            {
                headers: {
                    'Accept': 'application/xml',
                    'Authorization': "Basic " + auth
                }
            }
        );
        if (response.status === 200) {
            console.log("success from getLastFailureBuild");
            const data = response.data;
            const last_failure_build = {
                BuildNumber: data.id,
                URL: data.url,
                time: get_date_time_in_local(data.timestamp)
            }
            console.log(last_failure_build);
            return JSON.stringify(last_failure_build,null,2);
        }
        else {
            console.log("error after the axios request", response.status);
            return `after axios request error occured, ${response.status}`
            
            
        }
    }
    catch (err) {
        console.error("Error fetching build details:", err);
        return "No connection is established to Jenkins on our machine";
        
    }
}
// optional how to use this function maybe calling an api else reading from the config file which we already saved it..
const getNextBulidSchedule = async (jobName) => {

}

export const configureTheJob = async (jobName) => {
    const configXml = fs.readFileSync('xml_reponse_config.xml', 'utf-8');

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/job/Hello-world/config.xml\n',
        headers: {
            'Jenkins-Crumb':process.env.CRUMB,
            'Content-Type': 'application/xml',
            'Authorization': 'Basic Z2FuZXNoOjExODI5Y2YzYjAxYmJiY2Y4YTI4ZGQxNjE1ZmZhOTE4MTA=',
            'Cookie': 'JSESSIONID.2d3226da=node01uh4p9hji55dasu689wkgd2kr21.node0'
        },
        data: configXml
    };

    axios.request(config)
        .then((response) => {
            console.log(response.status);
        })
        .catch((error) => {
            console.log(error);
        });
}

export const buildTheJob=async (jobName)=>{
    try{
        const response=await axios.post(`http://localhost:8080/job/${jobName}/build`,null,{
            headers:{
                'Jenkins-Crumb': CRUMB_TOKEN, 
          'Authorization': 'Basic '+auth
            }
        });
        console.log(response.status,"Job Built Successfully");
        return `Job Built Successfully`;
    }
    catch(error){
        console.log(error);
        return "Some error in building the job";
        
    }
    
}



// jenkinsJobDetails("Hello-world");
// getJenkinsBuildNumDetails("Hello-world", 2);
// getJenkinsJobConfiguration("Hello-world");
// getLastFiveBuildsDetails("Hello-world");
// // getLastSuccessfulBuiltJob("Hello-world");
// getLastFailureBuild("Hello-world");
// // my_next_job_build_details(jobConfig);
// configureTheJob("Hello-world")   
// buildTheJob("Hello-world")