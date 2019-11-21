<template>
  <v-container>
    <v-row>
      <div id="chart">
        <apexchart ref="realtimeChart" type=bar height=700 :options="chartOptions" :series="series" />
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator'
import VueApexCharts from 'vue-apexcharts'

const colors = ['#F44336', '#4CAF50', '#2196F3', '#FFEB3B', '#9C27B0', '#009688']
const chartOptions = {
  chart: {
    height: '600px',
    width: '100%',
    type: 'bar'
    // events: {
    //   click: function (chart, w, e) {
    //     console.log(chart, w, e)
    //   }
    // },
  },
  colors: colors,
  plotOptions: {
    bar: {
      columnWidth: '95%',
      distributed: true
    }
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '32px'
    }
  },

  xaxis: {
    categories: ['Red', 'Green', 'Blue', 'Yellow', 'Pink', 'Teal'],
    labels: {
      style: {
        colors: colors,
        fontSize: '24px'
      }
    }
  },
  yaxis: {
    decimalsInFloat: 0,
    min: 0,
    max: function (max: number) {
      return max > 100 ? max : 100
    },
    labels: {
      style: {
        fontSize: '18px'
      }
    }
  }
}

@Component({
  components: {
    apexchart: VueApexCharts
  }
})

export default class GameProgress extends Vue {
  // private series: any
  private chartOptions: any
  private chart?: Element

  @PropSync('scores') series!: { data: number[]}[];

  public constructor () {
    super()
    this.chartOptions = chartOptions
  }
}
</script>

<style lang="css" scoped>
#chart, apexchart {
  width: 100%;
  min-height: 400px;
  max-height: 900px;
}
</style>
