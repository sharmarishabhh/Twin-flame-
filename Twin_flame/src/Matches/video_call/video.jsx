import React, { useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const Video = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  const handleAccept = () => {
    setShowOptions(true); // Show modal for options
  };

  const startVideoCall = async () => {
    const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    const appId = "your-app-id";
    const channelName = "test-channel";
    const token = null; // Replace with your token if required
    const userId = Math.floor(Math.random() * 10000).toString();

    try {
      await client.join(appId, channelName, token, userId);
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      await client.publish([audioTrack, videoTrack]);
      console.log("Video call started!");
    } catch (err) {
      console.error("Failed to start video call:", err);
    }
  };

  const scheduleCall = () => {
    console.log("Call scheduled for:", scheduleDate);
    alert(`Call scheduled for: ${scheduleDate}`);
    setShowOptions(false); // Close the modal
  };

  return (
    <div>
      <button onClick={handleAccept}>Accept</button>

      {showOptions && (
        <div className="modal">
          <h3>Choose an option</h3>
          <button onClick={startVideoCall}>Start Video Call</button>
          <div>
            <input
              type="datetime-local"
              onChange={(e) => setScheduleDate(e.target.value)}
            />
            <button onClick={scheduleCall}>Schedule Call</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Video;
