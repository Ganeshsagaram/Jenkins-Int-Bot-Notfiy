export const cardBody = {
    "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
    "type": "AdaptiveCard",
    "version": "1.0",
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
                "text": "Tell us about yourself",
                "weight": "bolder",
                "size": "medium"
              },
              {
                "type": "TextBlock",
                "text": "We just need a few more details to get you booked for the trip of a lifetime!",
                "isSubtle": true,
                "wrap": true
              },
              {
                "type": "TextBlock",
                "text": "Don't worry, we'll never share or sell your information.",
                "isSubtle": true,
                "wrap": true,
                "size": "small"
              },
              {
                "type": "TextBlock",
                "text": "Your name",
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "Name",
                "placeholder": "John Andersen"
              },
              {
                "type": "TextBlock",
                "text": "Your website",
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id" : "Url",
                "placeholder": "https://example.com"
              },
              {
                "type": "TextBlock",
                "text": "Your email",
                "wrap": true
              },
              {
                "type": "Input.Text",
                "id": "Email",
                "placeholder": "john.andersen@example.com",
                "style": "email"
              },
              {
                "type": "TextBlock",
                "text": "Phone Number"
              },
              {
                "type": "Input.Text",
                "id": "Tel",
                "placeholder": "+1 408 526 7209",
                "style": "tel"
              }
            ]
          },
          {
            "type": "Column",
            "width": 1,
            "items": [
              {
                "type": "Image",
                "url": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Diver_Silhouette%2C_Great_Barrier_Reef.jpg",
                "size": "auto"
              }
            ]
          }
        ]
      }
    ],
    "actions": [
      {
        "type": "Action.Submit",
        "title": "Submit"
      }
    ]
  };
// export default cardBody;