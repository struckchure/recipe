import { useEffect, useState } from "react";

import { API_URL } from "./env";

export function useQuery() {
  const [query, setQuery] = useState(
    new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setQuery(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, []);

  return query;
}

export function useGetAuthToken(userId: number, channelName: string) {
  const role = 1; // publisher

  const [token, setToken] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, channelName, role }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setToken(data.token);
      });
  }, [channelName, userId]);

  return { token };
}
