<template>
  <div>
    <h2>Chat</h2>
    <input v-model="targetPeerId" placeholder="Enter Peer ID to chat with" />
    <button @click="connectToPeer">Connect</button>

    <div v-if="conn">
      <h3>Connected to {{ targetPeerId }}</h3>
      <div v-for="msg in messages" :key="msg.id">{{ msg.text }}</div>
      <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message" />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/lib/stores/useAuthStore';

const authStore = useAuthStore();

const targetPeerId = ref('');
const conn = ref(null);
const message = ref('');
const messages = ref([]);

const connectToPeer = () => {
  if (!authStore.peer) {
    console.error('PeerJS is not initialized');
    return;
  }

  conn.value = authStore.peer.connect(targetPeerId.value);

  conn.value.on('open', () => {
    console.log('Connection established with', targetPeerId.value);
    messages.value.push({ id: Date.now(), text: `Connected to ${targetPeerId.value}` });
  });

  conn.value.on('data', (data) => {
    messages.value.push({ id: Date.now(), text: `Peer: ${data}` });
  });

  conn.value.on('error', (err) => {
    console.error('Connection error:', err);
  });
};

const sendMessage = () => {
  if (conn.value && conn.value.open) {
    conn.value.send(message.value);
    messages.value.push({ id: Date.now(), text: `You: ${message.value}` });
    message.value = '';
  } else {
    console.error('Connection is not open');
  }
};

// Handle incoming connections
authStore.peer.on('connection', (incomingConn) => {
  incomingConn.on('data', (data) => {
    messages.value.push({ id: Date.now(), text: `Peer: ${data}` });
  });

  incomingConn.on('open', () => {
    messages.value.push({ id: Date.now(), text: `Connected to ${incomingConn.peer}` });
  });

  incomingConn.on('error', (err) => {
    console.error('Incoming connection error:', err);
  });
});
</script>
