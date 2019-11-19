import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    devices: new Map<string, BluetoothDevice>(),
    characteristics: new Map<string, BluetoothRemoteGATTCharacteristic>()
  },
  mutations: {
    addDevice (state, data: { device: BluetoothDevice }) {
      state.devices.set('foo', data.device)
    },
    addCharacteristic (state, data: { characteristic: BluetoothRemoteGATTCharacteristic }) {
      state.characteristics.set('foo', data.characteristic)
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
