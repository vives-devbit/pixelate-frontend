<template>
  <v-container>
    <v-row v-for="player in players" v-bind:key="player.id" >
      <v-col md="2">
        <v-card :class="player.color" height="100" width="100"></v-card>
      </v-col>
      <v-col>
        <v-text-field
              :v-model="player.name"
              counter="20"
              :label="player.label"
              required
              class="large-input"
            ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

const PLAYER_COLORS = ['red', 'green', 'blue', 'yellow', 'pink', 'teal']

@Component
export default class PlayerEntries extends Vue {
  @Prop() private msg!: string;

  private players: [{id: number, color: string, name: string, label: string}?] = [];

  public constructor () {
    super()
    PLAYER_COLORS.forEach((color, index) => {
      this.players.push({
        id: index,
        color,
        name: '',
        label: `Speler ${index + 1}`
      })
    })
  }
}
</script>

<style>
  .large-input input{
    max-height: 80px !important;
  }
  .large-input .v-input__slot{
    height: 80px;
    font-size: 32pt;
    line-height: 80px;
  }
  .large-input label[for] {
    height: 80px;
    font-size: 16pt;
  }
</style>
