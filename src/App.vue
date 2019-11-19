<template>
  <v-app>
    <v-app-bar
      app
      color="red darken-2"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="PixelAte"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>
      <v-btn to="/" text>
        <v-icon left>mdi-gamepad-square</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="devices" text>
        <v-icon left>mdi-bluetooth-connect</v-icon>
        <span>Devices</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PixelAte'
})
</script>
