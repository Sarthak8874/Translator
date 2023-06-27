const express = require("express");
const router = new express.Router();
const textToSpeech = require("@google-cloud/text-to-speech");
const fs = require("fs");
const utils = require("util");
const path = require("path");

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const client = new textToSpeech.TextToSpeechClient({
  credentials: CREDENTIALS,
});

router.get("/get-audio", async (req, res) => {
  const request = {
    input: { text: req.query.text },
    voice: { languageCode: "hi", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);

  const writeFile = utils.promisify(fs.writeFile)

  await writeFile("output.mp3", response.audioContent, "binary");

  const filePath = path.join(__dirname, "../", "output.mp3");
  
  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", fs.statSync(filePath).size);

  const stream = fs.createReadStream(filePath);
  stream.pipe(res);

});

module.exports = router;
