import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";

function App() {
  const [text, setText] = useState("");
  const [transltedText, setTranslatedText] = useState("");
  const [audioSrc, setAudioSrc] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/get-audio", {
        responseType: "blob",
        params: { text: transltedText },
      })
      .then((response) => {
        const audioUrl = URL.createObjectURL(response.data);
        setAudioSrc(audioUrl);
      })
      .catch((error) => {
        console.error("Error retrieving audio:", error);
      });
    console.log("Fetch");
  }, [transltedText]);

  const handleDownloadClick = () => {
    if (audioSrc) {
      const link = document.createElement("a");
      link.href = audioSrc;
      link.download = "audio.mp3";
      link.click();
    }
  };
  function fetchText() {
    axios
      .get("http://localhost:3000/translate", {
        params: {
          text: text,
        },
      })
      .then((res) => {
        setTranslatedText(res.data.TranslatedText);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function checktext() {
    axios
      .get("http://localhost:3000/detectlanguage", {
        params: {
          text: text,
        },
      })
      .then((res) => {
        if (res.data.language === "en") {
          fetchText();
        } else {
          setTranslatedText("Text Should be in English");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const handletextOnchange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center m-5">
      <h1 className="text-3xl font-bold m-3">Translator</h1>
      <div className="m-3">
        <span className="text-3xl mr-5">Text</span>
        <input
          type="text"
          value={text}
          onChange={handletextOnchange}
          className="border border-black px-4 py-2 "
        />
      </div>
      <div className="m-4">
        <button
          className="bg-blue-500  text-black font-bold py-2 px-4"
          onClick={checktext}
        >
          Translate to hindi
        </button>
      </div>
      <div className="m-4 flex flex-row">
        <span className="text-2xl mr-5">TranslatedText</span>{" "}
        <div className="text-3xl mr-5 border p-2 border-black">
          {transltedText}
        </div>
      </div>
      <div className="m-4">
        <ReactAudioPlayer src={audioSrc} controls />
      </div>

      <button
        className="bg-black text-white font-bold py-2 px-4  m-4"
        onClick={handleDownloadClick}
      >
        Download
      </button>
    </div>
  );
}

export default App;
