<template>
  <v-container>
    <h1>Connect Devices</h1>
    <v-row justify="center">
      <v-col sm="12" md="8" lg="6">
        <v-card class="xs-6">
          <v-list two-line>
            <v-list-item v-if="items.length === 0">
              Connect to a device first.
            </v-list-item>
            <template v-for="(item, index) in items">
              <v-list-item :key="item.title">
                <v-list-item-avatar :class="item.color">
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                  <v-list-item-subtitle v-text="item.subtitle"></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="index + 1 < items.length" :key="index"></v-divider>
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="text-center">
        <v-btn large fab class="red" @click.stop="connect">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <v-btn to="/" color="secondary" right absolute x-large :disabled="items.length == 0">Play <v-icon>mdi-arrow-right</v-icon></v-btn>

    <v-dialog
      v-model="connectionStatus"

      persistent
      width="300"
    >
      <v-card color="primary">
        <v-card-title>
          <span class="headline">{{connectionStatusMessage}}</span>
        </v-card-title>
        <v-card-text>
          <v-progress-linear
            indeterminate
            color="white"

          ></v-progress-linear>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn text @click="connectionStatus = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'
import BluetoothManager from '@/lib/BluetoothManager'
import { ArrayPropsDefinition } from 'vue/types/options'

@Component({})
export default class Devices extends Vue {
  private bluetoothManager: BluetoothManager;
  private connectionStatus: boolean = false;
  private connectionStatusMessage: string = 'Connecting...';

  private items: Array<{icon: string, color: string, title: string, subtitle: string}> = [];

  public constructor () {
    super()
    this.bluetoothManager = new BluetoothManager(this.$store)
    this.bluetoothManager.on('connected', this.deviceConnected)
    this.bluetoothManager.on('error', (message: string) => {
      this.connectionStatusMessage = message
    })
    this.$store.getters.devices.forEach((device: BluetoothDevice, id: string) => {
      this.items.push({
        icon: 'mdi-bluetooth-connect',
        color: id,
        title: 'label',
        subtitle: `${device.name} - ${device.uuids}`
      })
    })
  }

  private connect () {
    this.connectionStatus = true
    this.bluetoothManager.addDevice()
  }

  private deviceConnected (device: BluetoothDevice, id: string) {
    this.items.push({
      icon: 'mdi-bluetooth-connect',
      color: id,
      title: id,
      subtitle: `${device.name}`
    })
    this.connectionStatus = false
  }
}
</script>
