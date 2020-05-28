import React, { useRef, useEffect, useState } from "react";
import RecordRTC, { StereoAudioRecorder } from "recordrtc";

import "./App.css";

function App() {
  const recorder = useRef();
  const audio = useRef();
  const canv = useRef();

  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    (async () => {
      // generate an image node that is not visible on the screen
      const ctx = canv.current.getContext("2d");
      const im = new Image();

      // after the image has loaded, print it to the canvas
      im.onload = () => {
        ctx.drawImage(im, 0, 0, 400, 400);

        // also get the image base64 and set that for later upload
        const url = canv.current.toDataURL(im.src);

        setImageFile(url);
      };

      // if you try to set the src before you set the onload event handler, the canvas will stay blank. so positioning is important.
      im.src = "https://i.imgur.com/b6yMSmX.png";

      // this fixes an error that is thrown by the canvas
      // https://ourcodeworld.com/articles/read/182/the-canvas-has-been-tainted-by-cross-origin-data-and-tainted-canvases-may-not-be-exported
      im.crossOrigin = "anonymous";

      // if the browser has access to media devices (requires localhost or https) get an audio stream on page load
      if (navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        // set up recorder
        recorder.current = new RecordRTC(stream, {
          recorderType: StereoAudioRecorder,
          disableLogs: true,
        });

        // start recording
        setTimeout(() => {
          console.log("starting recording audio...");
          recorder.current.startRecording();
        }, 1000);

        // check recording state.
        setTimeout(() => {
          console.log(
            "recorder state: " + "%c" + recorder.current.getState(),
            "color: blue; background: white; border-radius: 5px; padding: 2px 5px; font-weight: 700;"
          );
        }, 3000);

        // stop recording
        setTimeout(() => {
          console.log("stopping recording audio...");
          recorder.current.stopRecording((blobUrl) => {
            audio.current.src = blobUrl;

            recorder.current.getDataURL(setAudioFile);
          });
        }, 5000);
      }
    })();
  }, []);

  // does not actually upload anywhere. this just shows the previously generated base64 code for the image and audio files. the implementation would be in charge of sending those strings to a server for processing.
  function upload() {
    console.log("processing data to be sent to server...");
    console.log(
      `%cimage file:\n${imageFile.substr(0, 150)}...`,
      "color: lightgreen"
    );
    console.log(
      `%caudio file:\n${audioFile.substr(0, 150)}...`,
      "color: lightgreen"
    );
  }

  return (
    <div className="App">
      <h1>hello audio recorder</h1>
      <audio
        controls
        autoPlay
        ref={audio}
        src={null}
        style={{ height: "50px", width: "300px", outline: "unset" }}
      />

      <canvas
        ref={canv}
        height={400}
        width={400}
        style={{ border: "1px solid gray" }}
      />

      <button onClick={upload}>UPLOAD</button>
    </div>
  );
}

export default App;
