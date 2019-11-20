<template>
  <div class="home container">
    <GameProgress v-bind:scores.sync="scores"/>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import GameProgress from '@/components/GameProgress.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: {
    GameProgress
  }
})

export default class Home extends Vue {
  private scores = [{
    data: [0, 0, 0, 0, 0, 0]
  }]

  public mounted () {
    // TODO get game stat updates here to update chart...
    window.setInterval(() => {
      this.scores = [{
        data: [ Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20, Math.random() * 20 ]
      }]
    }, 3000)
  }
}
</script>
