from requests import get,post
import config
import json 
url = "https://webexapis.com/v1/rooms"

payload = None

headers = {
    "Accept": "application/json",
    "Authorization": "Bearer"+" "+config.MY_ACCESS_TOKEN
}

response = get(url, headers=headers, data = payload)

if response.status_code==200:
    
    readable_format=json.loads(response.text)
    with open("my_rooms.json","w") as file:
        json.dump(readable_format,file,indent=2)
        
else:
    print("error")
    print(response.text)

