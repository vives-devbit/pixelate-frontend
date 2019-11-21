import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    devices: new Map<string, BluetoothDevice>(),
    characteristics: new Map<string, BluetoothRemoteGATTCharacteristic>()
  },
  mutations: {
    addDevice (state, data: { device: BluetoothDevice, id: string }) {
      state.devices.set(data.id, data.device)
    },
    addCharacteristic (state, data: { characteristic: BluetoothRemoteGATTCharacteristic, id: string }) {
      state.characteristics.set(data.id, data.characteristic)
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    devices: (state) => state.devices,
    characteristics: (state) => state.characteristics
  }
})
