import config
from requests import get,post
import json

def getRoomId()->str:
    f = open("room_details.json", "r")
    json_string = f.read()
    data = json.loads(json_string)
    f.close()
    ROOM_ID=data['id']
    return ROOM_ID
MY_ROOM_ID=getRoomId()
header= {
    
    "Authorization": "Bearer"+" "+config.MY_ACCESS_TOKEN,
    "Content-Type": "application/json",
    
}
payload = {
    "roomId":MY_ROOM_ID,
    "text":"For jenkins Failure",
    "title":"My New Message"
}

reponse=post(config.BASE_URI,json=payload,headers=header)
if reponse.status_code==200:
    print(reponse.json())
else:
    print(reponse.status_code," ",reponse.json(),sep="\n")


