<template>
  <div>
      <v-progress-linear
        color="blue"
        :value="timer * (100 / 60)"
        height="75"
        reactive
      >
      <template v-slot="{ value }">
        <strong class="display-2">{{ Math.ceil(value * (60 / 100)) }} sec</strong>
      </template>
      </v-progress-linear>
    <div class="home container">
      <GameProgress v-bind:scores.sync="scores"/>
      <v-row>
        <v-btn x-large color="red" dark @click="startGame">Start new game <v-icon dark right>mdi-play</v-icon></v-btn>
      </v-row>
    </div>
    <v-dialog v-model="gameOver" width="600">
      <v-card color="red" class="justify-center" dark>
        <v-card-title class="text-center display-4 pa-11 justify-center">
          Game <br/>Over!
        </v-card-title>
        <v-card-text>
          <p class="headline text-center">
            {{ winner }} has won
          </p>
          <p class="display-1 text-center">
            winner winner 🐔🍽️
          </p>
        </v-card-text>
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

const colorMap = new Map<string, string>()
colorMap.set('red', '#FF0000')
colorMap.set('green', '#00FF00')
colorMap.set('blue', '#0000FF')
colorMap.set('yellow', '#FF00FF')
colorMap.set('ping', '#00FFFF')
colorMap.set('purple', '#FFFF00')

const playerOrder = [ ...colorMap.keys() ]

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
  private winner: string = 'Sille';

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
    const players: any = []
    this.$store.getters.characteristics.forEach((device: BluetoothRemoteGATTCharacteristic, id: string) => {
      players.push({
        controller_id: id,
        name: id,
        color: colorMap.get(id)
      })
    })
    this.capture.start();
    (this as any).$socket.emit('start', JSON.stringify(players))
  }

  @SocketIO({ name: 'gamestate' })
  private gamestate (data: any) {
    data = JSON.parse(data)
    const stats = playerOrder.map(color => {
      const player = data.stats.find((stat: any) => {
        return stat.id === color
      })
      return player ? player.fieldcount : 0
    })
    this.scores = [{
      data: stats
    }]
    this.timer = data.timeleft
    if (this.timer === 0) {
      this.gameOver = true
    }
    const ranking = data.stats.sort((a: any, b: any) => (a.fieldcound > b.fieldcount) ? 1 : -1)
    this.winner = ranking[0].id
  }
}
</script>
