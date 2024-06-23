import { useState } from "react";

export function Lobby() {
  const [channelName, setChannelName] = useState<string>();

  const joinRoom = () => {
    window.location.href += `?channelName=${channelName}`;
  };

  return (
    <section className="w-full h-full grid place-items-center place-content-center">
      <form
        className="w-full h-full flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          joinRoom();
        }}
      >
        <label>Enter Room Name</label>
        <input
          required
          minLength={5}
          maxLength={10}
          type="text"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
        />

        <button type="submit">Join</button>
      </form>
    </section>
  );
}
