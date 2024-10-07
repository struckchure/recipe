<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import svelteLogo from "./assets/svelte.svg";
  import Counter from "./lib/Counter.svelte";
  import viteLogo from "/vite.svg";

  import { RodelarClient, type IMessageResponse } from "rodelar/core";

  let client: RodelarClient;
  let data = writable<IMessageResponse>();
  $: if (data) {
    console.log("TEST: FROM STATE: ", data);
  }

  onMount(() => {
    client = new RodelarClient({ url: "ws://localhost:9090/ws" });

    setTimeout(() => {
      client.subscribe({
        event: "TEST",
        callback(_data) {
          data.set(_data);
        },
      });
    }, 1_000);
  });

  // Cleanup the client when the component is destroyed
  onDestroy(() => {
    if (client) {
      client.unsubscribe({ event: "TEST" }); // Assuming you have an unsubscribe method
      client.close(); // Close the WebSocket connection if necessary
    }
  });
</script>

<main>
  <div>
    <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
      <img src={viteLogo} class="logo" alt="Vite Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
    <button on:click={client.publish({ event: "TEST", message: "hello" })}>
      Test Publishing
    </button>
  </div>

  <p>
    Check out <a
      href="https://github.com/sveltejs/kit#readme"
      target="_blank"
      rel="noreferrer">SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
