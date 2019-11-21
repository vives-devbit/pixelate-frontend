<template>
  <div>
      <v-progress-linear
        color="blue"
        :value="timer * (100 / 60)"
        height="50"
        reactive
      >
      <template v-slot="{ value }">
        <strong>{{ Math.ceil(value * (60 / 100)) }} seconden</strong>
      </template>
      </v-progress-linear>
    <div class="home container">
      <GameProgress v-bind:scores.sync="scores"/>
      <v-row>
        <v-btn x-large color="red" dark @click="startGame">Start new game <v-icon dark right>mdi-play</v-icon></v-btn>
      </v-row>
    </div>
    <v-dialog v-model="gameOver" width="600">
      <v-card color="red" class="justify-center">
        <v-card-title class="text-center display-4 pa-11 justify-center">
          Game <br/>Over!
        </v-card-title>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import GameProgress from '@/components/GameProgress.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { SocketIO } from 'vue-plugin-helper-decorator'

import BluetoothManager from '@/lib/BluetoothManager'
import CaptureManager from '@/lib/CaptureManager'

const players = [
  { controller_id: 'red', name: 'red', color: '#FF0000' },
  { controller_id: 'green', name: 'green', color: '#00FF00' },
  { controller_id: 'blue', name: 'blue', color: '#0000FF' },
  { controller_id: 'yellow', name: 'yellow', color: '#FF00FF' },
  { controller_id: 'pink', name: 'pink', color: '#00FFFF' },
  { controller_id: 'teal', name: 'teal', color: '#FFFF00' }
]

@Component({
  components: {
    GameProgress
  }
})

export default class Home extends Vue {
  private bluetooth: BluetoothManager
  private capture: CaptureManager

  private timer: number = 60
  private gameOver: boolean = false;

  private scores = [{
    data: [0, 0, 0, 0, 0, 0]
  }]

  public constructor () {
    super()
    this.bluetooth = new BluetoothManager(this.$store)
    this.capture = new CaptureManager(this.bluetooth, (this as any).$socket)
  }

  private startGame () {
    console.log('Starting the game')
    this.capture.start();
    (this as any).$socket.emit('start', JSON.stringify(players))
  }

  @SocketIO({ name: 'gamestate' })
  private gamestate (data: any) {
    data = JSON.parse(data)
    console.log(data)
    this.scores = [{
      data: [
        data.stats[0].fieldcount,
        data.stats[1].fieldcount,
        data.stats[2].fieldcount,
        data.stats[3].fieldcount,
        data.stats[4].fieldcount,
        data.stats[5].fieldcount
      ]
    }]
    this.timer = data.timeleft
    if (this.timer === 0) {
      this.gameOver = true
    }
  }
}
</script>
