# Jenkins-Int-Bot-Notify

## Project Overview

This repository is built to **learn Jenkins automation** and **send job status notifications** to a **Webex group**. These updates can be triggered using **Webex bot commands**.

---

## Setup Instructions

### 1. Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone <repository_url>
cd node-webesever
```

---

### 2. Create a `.env` File

Inside the `node-webesever` folder, create a `.env` file and add the following environment variables:

```env
PORT=
JENKINS_API_TOKEN=
CRUMB=
REQUEST_FIELD=
JENKINS_WEBEX_ROOM_ID=
BOTTOKEN=
WEBHOOKURL=
```

#### Environment Variable Descriptions

* `PORT` – Port on which the local Node web server runs.
* `JENKINS_API_TOKEN` – Generate this token from your Jenkins dashboard.
* `CRUMB` – Required by Jenkins for CSRF protection. Retrieve it via:

  ```
  http://<your_jenkins_url>/crumbIssuer/api/json
  ```
* `REQUEST_FIELD` – Optional; depends on your crumb issuer configuration.
* `JENKINS_WEBEX_ROOM_ID` – Webex room ID where notifications are sent.
* `BOTTOKEN` – Webex bot's access token.
* `WEBHOOKURL` – Public webhook URL, exposed via Ngrok.

---

### 3. Get the Webex Room ID

Run the following Python script to retrieve your Webex Room ID:

```bash
python python_scripts_get_room_details/get_all_my_rooms.py
```

Before executing the script, create a `config.py` file with:

```python
MY_ACCESS_TOKEN = "<your_webex_access_token>"
BASE_URI = "https://webexapis.com/v1/rooms"
```

* `MY_ACCESS_TOKEN`: Available on the [Webex Developer Portal](https://developer.webex.com/docs/getting-started).
* `BASE_URI`: Leave as is.
* Confirm room setup by sending a test message via `post_message.py`.

---

### 4. Create a Webex Bot

Follow the [official Webex bot documentation](https://developer.webex.com/messaging/docs/bots) to:

* Create a new bot.
* Copy the bot token and assign it to `BOTTOKEN` in `.env`.

---

### 5. Expose Jenkins Locally with Ngrok

Use [Ngrok](https://ngrok.com/) to expose your Jenkins instance (usually running on port 8080):

```bash
ngrok http 8080
```

* Use the generated HTTPS URL as your `WEBHOOKURL`.
* Ensure Ngrok is active while using the bot.
* If Ngrok restarts, update the `.env` with the new URL.

---

### 6. Install Dependencies and Run the Bot

To install all required packages and run the bot:

```bash
cd node-webesever
npm install
```

Update the `package.json` file to include the following start script:

```json
"scripts": {
  "start": "nodemon index.js"
}
```

Then start the server:

```bash
npm start
```

You should see:

```bash
framework is all fired up! [Press CTRL-C to quit]
```

At this point, the bot is running and ready.

Add the bot to your Webex space, and start interacting with it.

Try the command:

```text
jenkins-form
```

This will trigger a Jenkins form. From there, you can query the bot and automate Jenkins tasks efficiently.

---
