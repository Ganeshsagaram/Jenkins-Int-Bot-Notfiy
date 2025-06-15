import axios from "axios"

let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:8080/job/Hello-world/build',
    headers: { 
      'Jenkins-Crumb': '7e342d0a92d514b64a2f56cd33d125b2c09ce182f139de7b2977f3985a80b0f', 
      'Authorization': 'Basic Z2FuZXNoOjExODI5Y2YzYjAxYmJiY2Y4YTI4ZGQxNjE1ZmZhOTE4MTA=', 
      'Cookie': 'JSESSIONID.2d3226da=node01uh4p9hji55dasu689wkgd2kr21.node0'
    }
  };
  
  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });