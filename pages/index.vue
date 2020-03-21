<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <v-card min-width="400" style="margin-top:50%;">
        <v-snackbar
          v-model="snackbar"
          :timeout="6000"
          top
        >
          {{ message }}
          <v-btn dark text @click="snackbar = false">Close</v-btn>
        </v-snackbar>
        <v-card-title>Nuxt Chat</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="name"
              :counter="16"
              :rules="nameRules"
              label="Input your name"
              required
            ></v-text-field>
            <v-text-field v-model="room" :rules="roomRules" label="Input room number" required></v-text-field>
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="submit">Enter</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  layout: "empty",
  sockets: {
    connect: function() {
      console.log("socket connected");
    }
  },
  head: {
    title: "Добро пожаловать в Nuxt chat"
  },
  data: () => ({
    valid: true,
    snackbar:false,
    message:"",
    name: "",
    nameRules: [
      v => !!v || "Input your name!",
      v => (v && v.length <= 16) || "Name must be less than 16 characters"
    ],
    room: "",
    roomRules: [v => !!v || "Input room number!"]
  }),
  mounted(){
    const {message} = this.$route.query
    if (message === 'noUser') {
      this.message = 'Input data!';
    } else if (message === 'leftChat') {
      this.message = 'You left the chat.';
    }

    this.snackbar = !!this.message
  },
  methods: {
    ...mapMutations(["setUser"]),
    submit() {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          room: this.room
        };

        this.$socket.emit("userJoined", user, data => {
          if (typeof data === String) {
            console.error(data);
          } else {
            user.id = data.userId;
            this.setUser(user);
            this.$router.push("/chat");
          }
        });
      }
    }
  }
};
</script>

