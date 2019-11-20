<template>
  <div class="home container">
    <PlayerEntries/>
    <v-row>
      <v-btn large color="red" dark @click="startGame">Start new game</v-btn>
    </v-row>
    <TopScores/>
    <GamesHistory/>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import PlayerEntries from '@/components/PlayerEntries.vue'
import TopScores from '@/components/TopScores.vue'
import GamesHistory from '@/components/GamesHistory.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

import BluetoothManager from '@/lib/BluetoothManager'
import CaptureManager from '@/lib/CaptureManager'

@Component({
  components: {
    PlayerEntries, TopScores, GamesHistory
  }
})

export default class Home extends Vue {
  private bluetooth: BluetoothManager
  private capture: CaptureManager

  public constructor () {
    super()
    this.bluetooth = new BluetoothManager(this.$store)
    this.capture = new CaptureManager(this.bluetooth)
  }

  private startGame () {
    console.log('Starting the game')
    this.capture.start()
  }
}
</script>
