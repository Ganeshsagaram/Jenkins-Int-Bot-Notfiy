import config
import json
from requests import get,post


url = f"https://webexapis.com/v1/rooms/{config.MY_ROOM_ID}"

payload = None

headers = {
    "Accept": "application/json",
    "Authorization": "Bearer"+" "+config.MY_ACCESS_TOKEN
}

response = get(url, headers=headers, data = payload)
# print(dir(response))
if response.status_code==200:
    
    readable_format=json.loads(response.text)
    with open("room_details.json","w") as file:
        json.dump(readable_format,file,indent=2)
        
else:
    print("error")
    print(response.text)



