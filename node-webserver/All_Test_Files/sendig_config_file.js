import axios from "axios";
import fs from "fs";
const configXml = fs.readFileSync('xml_reponse_config.xml', 'utf-8');

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:8080/job/Hello-world/config.xml\n',
  headers: { 
    'Jenkins-Crumb': '7e342d0a92d514b64a2f56cd33d125b2c09ce182f139de7b2977f3985a80b0f', 
    'Content-Type': 'application/xml', 
    'Authorization': 'Basic Z2FuZXNoOjExODI5Y2YzYjAxYmJiY2Y4YTI4ZGQxNjE1ZmZhOTE4MTA=', 
    'Cookie': 'JSESSIONID.2d3226da=node01uh4p9hji55dasu689wkgd2kr21.node0'
  },
  data : configXml
};

axios.request(config)
.then((response) => {
  console.log(response.status);
})
.catch((error) => {
  console.log(error);
});
