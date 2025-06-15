export const jenkinsDetailsBody = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.3",
    "body": [
      {
        "type": "ColumnSet",
        "columns": [
          {
            "type": "Column",
            "width": 2,
            "items": [
              {
                "type": "TextBlock",
                "text": "Query the Jenkins Job and Build the Jobs",
                "size": "Large",
                "weight": "Bolder",
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "Enter Job Name:",
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "jobName",
                "placeholder": "e.g., hello-world"
              },
              {
                "type": "TextBlock",
                "text": "Select Jenkins Query:",
                "wrap": true
              },
              {
                "type": "Input.ChoiceSet",
                "id": "environment",
                "style": "compact",
                "placeholder": "Choose an action",
                "choices": [
                  {
                    "title": "Get Job Details",
                    "value": "get-job-info"
                  },
                  {
                    "title": "Get Individual Job Build Details",
                    "value": "get-individual-built"
                  },
                  {
                    "title": "Get Last Failed Build",
                    "value": "get-failure-built"
                  },
                  {
                    "title": "Get Last Successful Build",
                    "value": "get-last-success-built"
                  },
                  {
                    "title": "Get Job Config",
                    "value": "get-job-config"
                  },
                  {
                    "title": "Build Job Now",
                    "value": "build-job"
                  },
                  {
                    "title":"Last Five Build details",
                    "value":"get-last-five-builds"
                  },
                  {
                    "title":"Next scheduled build",
                    "value":"get-next-scheduled-build-time"
                  }
                ]
              },
              {
                "type": "TextBlock",
                "text": "Optional: Provide Build Number (required only for specific actions)",
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "buildNumber",
                "placeholder": "e.g., 102 (Only for individual builds)"
              }
            ]
          }
        ]
      }
    ],
    "actions": [
      {
        "type": "Action.Submit",
        "title": "Submit",
        "data": {
          "action": "runJenkinsOperation"
        }
      }
    ]
  };
  