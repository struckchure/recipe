import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useEffect, useState } from "react";

import personIcon from "../assets/person.svg";
import { ALGORA_APP_ID } from "../env";
import { useGetAuthToken } from "../hooks";
import { RoomProps } from "../types";

export function Room({ userId, channelName }: RoomProps) {
  const appId = ALGORA_APP_ID;
  const { token } = useGetAuthToken(userId, channelName);

  const [calling, setCalling] = useState(true);
  const { error, isConnected, isLoading } = useJoin(
    {
      appid: appId,
      channel: channelName,
      token: token ? token : null,
    },
    calling
  );

  useEffect(() => {
    if (error) {
      alert(error.message);
    }
  }, [error]);

  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <div className="w-full h-full relative">
      <label className="w-fit">
        {isConnected
          ? "Connected"
          : isLoading
          ? "Connecting ..."
          : "Not Connected"}
      </label>

      {isConnected && (
        <>
          <div className="w-full h-full">
            <div className="w-[200px] h-[200px] rounded-lg overflow-hidden absolute bottom-0 right-0">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover={personIcon}
              >
                <label className="p-2">You</label>
              </LocalUser>
            </div>

            <div className="flex flex-wrap gap-4 w-full h-full justify-center items-center">
              {remoteUsers.map((user) => (
                <div
                  className="w-[200px] h-[200px] md:w-[400px] md:h-[400px] rounded-lg overflow-hidden"
                  key={user.uid}
                >
                  <RemoteUser user={user} cover={personIcon}>
                    <label className="p-2">{user.uid}</label>
                  </RemoteUser>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center w-fit mx-auto gap-2">
            <button className="control" onClick={() => setMic((a) => !a)}>
              <span className="material-symbols-outlined">
                {!micOn ? "mic_off" : "mic"}
              </span>
            </button>

            <button className="control" onClick={() => setCamera((a) => !a)}>
              <span className="material-symbols-outlined">
                {!cameraOn ? "videocam_off" : "videocam"}
              </span>
            </button>

            <button
              className="control !bg-red-400"
              onClick={() => setCalling((a) => !a)}
            >
              <span className="material-symbols-outlined">call_end</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
