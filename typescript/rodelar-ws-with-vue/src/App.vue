<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import { RodelarClient, type IMessageResponse } from "rodelar/core";
import { onMounted, onUnmounted, ref, watch } from "vue"

let client: RodelarClient;

const message = ref<Record<string, any>>({}); // Initialize message as an empty object

// Watch for changes in the message
watch(message, (newMessage) => {
  console.log("TEST: ", newMessage);
});

onMounted(() => {
  client = new RodelarClient({ url: "ws://localhost:9090/ws" });

  setTimeout(() => {
    client.subscribe({
      event: "TEST",
      callback(data) {
        // Ensure data is assigned as a new reference
        message.value = { ...data };  // Spread to create a new reference
      },
    });
  }, 1_000);
});

// Cleanup the client when the component is destroyed
onUnmounted(() => {
  if (client) {
    client.unsubscribe({ event: "TEST" }); // Assuming you have an unsubscribe method
    client.close(); // Close the WebSocket connection if necessary
  }
});

// Publish a test message to the WebSocket server
const pub = () => {
  client.publish({ event: "TEST", message: "hello" });
};
</script>


<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <button @click="pub">TEST publish</button>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
