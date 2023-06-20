const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");
const cors = require("cors");
const app = express();
// Enable CORS
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("DevBeans API");
});

app.post("/improve-code", async (req, res) => {
  const htmlCode = req.body.code;
  try {
    if (htmlCode == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "user",
          content: `Convert this HTMl code into React.js functional component , code:-${htmlCode} \n\n-Only provide code of react.js, no text or message is accepatble in output \n-Code should be clean with reusable funtional component \n- Also add state to react.js code`
        }
      ]
    });
    const code = response.data.choices[0].message.content;
    return res.status(200).json({
      success: true,
      code: code
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      error: true,
      message: error.message
    });
  }
});

const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}`));
