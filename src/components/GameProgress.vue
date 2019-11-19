<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class GameProgress extends Vue {
  @Prop() private msg!: string;
}
</script>

<style>

</style>
