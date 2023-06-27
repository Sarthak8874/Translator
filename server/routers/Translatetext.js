const express = require("express");
const router = new express.Router();
const { Translate } = require("@google-cloud/translate").v2;

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.projectId,
});

router.get("/translate", async (req, res) => {
  try {
    const [translation] = await translate.translate(req.query.text, "hi");
    res.send({ TranslatedText: translation });
  } catch (e) {
    console.log(e);
  }
});

router.get("/detectlanguage", async (req, res) => {
  try {
    let [detections] = await translate.detect(req.query.text);
    detections = Array.isArray(detections) ? detections : [detections];
    res.send({ language: detections[0].language });
  } catch (e) {
    console.log("Error:", e);
    res.status(500).send("Language detection failed");
  }
});
module.exports = router;
