import express from "express"
import dotenv from "dotenv";
dotenv.config();
import bodyParse from "body-parser";
import cors from "cors";

import webexNodeBotFramework from "webex-node-bot-framework";
import  webhook from "webex-node-bot-framework/webhook.js";
// import {bot} from "webex-node-bot-framework"
import { cardBody } from "./input-card-details.js";
import { jenkinsDetailsBody } from "./jenkins-job-details.js";
import { buildTheJob, getJenkinsBuildNumDetails, getJenkinsJobConfiguration, getLastFailureBuild, getLastFiveBuildsDetails, getLastSuccessfulBuiltJob, jenkinsJobDetails } from "./jenkins-api.js";
var app = express();
app.use(bodyParse.json());

const config = {
  token: process.env.BOTTOKEN,
};

if (process.env.WEBHOOKURL && process.env.PORT) {
  config.webhookUrl = process.env.WEBHOOKURL;
  config.port = process.env.PORT;
}
function get_date_time_in_local() {
  const now = new Date();


  const currentDateTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Convert to IST

  return currentDateTime;

}
let cardJSON = {
  $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
  type: "AdaptiveCard",
  version: "1.0",
  body: [
    {
      type: "ColumnSet",
      columns: [
        {
          type: "Column",
          width: "5",
          items: [
            {
              type: "Image",
              url: "Your avatar appears here!",
              size: "large",
              horizontalAlignment: "Center",
              style: "person",
            },
            {
              type: "TextBlock",
              text: "Your name will be here!",
              size: "medium",
              horizontalAlignment: "Center",
              weight: "Bolder",
            },
            {
              type: "TextBlock",
              text: "And your email goes here!",
              size: "small",
              horizontalAlignment: "Center",
              isSubtle: true,
              wrap: false,
            },
          ],
        },
      ],
    },
  ],
};



var framework = new webexNodeBotFramework(config);
framework.start();
console.log("Starting framework, please wait...", config.port);

framework.on("initialized", () => {
  console.log("framework is all fired up! [Press CTRL-C to quit]");
});
// framework.webex.once("ready",async()=>{
//   try {
//     console.log('Deregistering unused devices (dev mode)...');
//     await framework.webex.internal.device.unregister();
//   } catch (err) {
//     console.warn('Device unregistration failed or unnecessary.');
//   }
// })

framework.hears(
  /jenkins/gmi,
  (bot) => {
    console.log("Jenkins command received");
    bot.say(
      "markdown",
      "Primary Purpose is to serve the Jenkins Messages"
    );
  },
  "**jenkins**: (learn more about the Jenkins Automation)",
  0
);
framework.hears(
  /hi (?:all|everyone|)/gmi,
  (bot) => {
    console.log("say hi to everyone.  Its a party");
    // Use the webex SDK to get the list of users in this space
    bot.webex.memberships
      .list({ roomId: bot.room.id })
      .then((memberships) => {
        for (const member of memberships.items) {
          if (member.personId === bot.person.id) {
            // Skip myself!
            continue;
          }
          let displayName = member.personDisplayName
            ? member.personDisplayName
            : member.personEmail;
          bot.say(`Hello ${displayName}`);
        }
      })
      .catch((e) => {
        console.error(`Call to sdk.memberships.get() failed: ${e.messages}`);
        bot.say("Hello everybody!");
      });
  },
  "**say hi to everyone**: (everyone gets a greeting using a call to the Webex SDK)",
  0
);
framework.hears(
  "card me",
  (bot, trigger) => {
    console.log("someone asked for a card");
    let avatar = trigger.person.avatar;

    cardJSON.body[0].columns[0].items[0].url = avatar
      ? avatar
      : `${config.webhookUrl}/missing-avatar.jpg`;
    cardJSON.body[0].columns[0].items[1].text = trigger.person.displayName;
    cardJSON.body[0].columns[0].items[2].text = trigger.person.emails[0];
    bot.sendCard(
      cardJSON,
      "This is customizable fallback text for clients that do not support buttons & cards"
    );
  },
  "**card me**: (a cool card!)",
  0
);
framework.hears(
  "info",
  (bot, trigger) => {
    console.log("info command received");
    //the "trigger" parameter gives you access to data about the user who entered the command
    let personAvatar = trigger.person.avatar;
    let personEmail = trigger.person.emails[0];
    let personDisplayName = trigger.person.displayName;
    let outputString = `Here is your personal information: \n\n\n **Name:** ${personDisplayName}  \n\n\n **Email:** ${personEmail} \n\n\n **Avatar URL:** ${personAvatar}`;
    bot.say("markdown", outputString);
  },
  "**info**: (get your personal details)",
  0
);

framework.hears(/time/gmi, (bot, trigger) => {
  console.log(`${bot.text}`);
  bot.say(
    "markdown",
    `Current date and time is ${get_date_time_in_local()}`
  );
},

  0
)

framework.on("log", (msg) => {
  console.log(msg);
});


framework.hears('jenkins-form', (bot) => {
  // Fallback text for clients that don't render cards - messageFormat (in this example using Markdown) is defined in Framework Options
  const fallbackText = "Testing Drop Down";
  bot.sendCard(jenkinsDetailsBody, fallbackText);
});

framework.on('attachmentAction', async (bot, trigger) => {
  const { action, buildNumber, environment, jobName } = trigger.attachmentAction.inputs;
  console.log(action, buildNumber, environment, jobName)
  let responseMessage = "";

  try {
    switch (environment) {
      case "get-job-info":
        responseMessage = "Here is your job info" + await jenkinsJobDetails(jobName);
        break;

      case "get-individual-built":
        responseMessage = buildNumber
          ? `For ${buildNumber} build here is the details` + await getJenkinsBuildNumDetails(jobName, buildNumber)
          : "Invalid build number provided.";
        break;

      case "get-failure-built":
        responseMessage = "Last failure Build" + await getLastFailureBuild(jobName);
        break;

      case "get-last-success-built":
        responseMessage = "Last success build" + await getLastSuccessfulBuiltJob(jobName);
        break;

      case "get-job-config":
        responseMessage = `Here is your ${jobName} job configuration` + await getJenkinsJobConfiguration(jobName);
        break;

      case "build-job":
        responseMessage = await buildTheJob(jobName);
        break;

      case "get-last-five-builds":
        responseMessage = await getLastFiveBuildsDetails(jobName);
        break;

      case "get-next-scheduled-build-time":
        responseMessage = await getJenkinsJobConfiguration(jobName, 1);
        break;

      default:
        responseMessage = " Error: Unknown environment command.";
    }
  } catch (error) {
    console.error("Error processing Jenkins command:", error);
    responseMessage = "Internal server error while processing your request.";
  }
  console.log(responseMessage);
  // Send the final response
  bot.say(responseMessage);

});
framework.hears(
  /.*/,
  (bot, trigger) => {
    // This will fire for any input so only respond if we haven't already
    console.log(`catch-all handler fired for user input: ${trigger.text}`);
    bot
      .say(`Sorry, I don't know how to respond to "${trigger.text}"`)
      .then(() => bot.say("markdown", framework.showHelp()))
      //    .then(() => sendHelp(bot))
      .catch((e) =>
        console.error(`Problem in the unexepected command hander: ${e.message}`)
      );
  },
  99999
);
app.get("/", (req, res) => {
  res.send(`I'm alive.`);
});

app.post("/", webhook(framework));

var server = app.listen(config.port, () => {
  framework.debug("framework listening on port %s", config.port);
});

// gracefully shutdown (ctrl-c)
process.on("SIGINT", () => {
  framework.debug("stopping...");
  server.close();
  framework.stop().then(() => {
    process.exit();
  });
});
