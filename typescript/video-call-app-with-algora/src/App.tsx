import AgoraRTC, { AgoraRTCProvider } from "agora-rtc-react";
import { useMemo } from "react";

import { useQuery } from "./hooks";
import { Lobby } from "./pages/lobby";
import { Room } from "./pages/room";

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

export function App() {
  const query = useQuery();

  const userId = useMemo(() => {
    return (
      Math.floor(Math.random() * (99_999_999 - 10_000_000 + 1)) + 10_000_000
    );
  }, []);
  const channelName = query.get("channelName") as string;
  const isRoomReady = channelName?.length > 0;

  return (
    <main className="w-full h-[95vh] p-10">
      <AgoraRTCProvider client={client}>
        {isRoomReady ? (
          <Room userId={userId} channelName={channelName} />
        ) : (
          <Lobby />
        )}
      </AgoraRTCProvider>
    </main>
  );
}
