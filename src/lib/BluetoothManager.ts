import { Store } from 'vuex'
import { EventEmitter } from 'events'

/* tslint:disable:no-console */

// const BluetoothDeviceNamePrefix: string = 'AM1'
const ServiceUuid: string = 'ecceef7c-2d85-4b1a-889b-5dd536de1d38'
const CharacteristicUuid: string = 'ce8ec8f3-b582-4928-9db0-f6626f8b87c9'

export default class BluetoothManager extends EventEmitter {
  private store: Store<any>

  public constructor (store: Store<any>) {
    super()
    this.store = store
  }

  public addDevice () {
    let device: BluetoothDevice
    const requestOptions: RequestDeviceOptions = {
      filters: [{ services: [ServiceUuid] }]
      // optionalServices: [ServiceUuid]
    }

    navigator.bluetooth.requestDevice(requestOptions)
      .then((dev: any) => {
        const gatt = dev.gatt
        if (gatt !== undefined) {
          device = dev
          this.storeDevice(dev)
          return gatt.connect()
        }
      })
      .then((server: BluetoothRemoteGATTServer) => {
        console.log('getting primary service')
        return server.getPrimaryService(ServiceUuid)
      })
      .then((service: BluetoothRemoteGATTService) => {
        console.log('getting characteristic')
        return service.getCharacteristic(CharacteristicUuid)
      })
      .then((characteristic: BluetoothRemoteGATTCharacteristic) => {
        console.log('characteristic found')
        this.emit('connected', device)
        this.storeCharacteristic(characteristic)
      })
      .catch((error) => {
        console.log(error.message)
        this.emit('error', error.message)
      })
  }

  public startNotifications () {
    const characteristics = this.store.getters.characteristics
    characteristics.forEach((characteristic: BluetoothRemoteGATTCharacteristic) => {
      characteristic.startNotifications().then(() => {
        characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target ? event.target.value : 0
          const command = String.fromCharCode(new Int8Array(value.buffer)[0])
          // console.log(event)
          this.emit('data', 'color_id', command)
        })
      })
    })
  }

  public stopNotifications () {
    const characteristics = this.store.getters.characteristics
    characteristics.forEach((characteristic: BluetoothRemoteGATTCharacteristic) => {
      characteristic.stopNotifications()
    })
  }

  private storeDevice (device: BluetoothDevice) {
    this.store.commit('addDevice', { device })
  }

  private storeCharacteristic (characteristic: BluetoothRemoteGATTCharacteristic) {
    this.store.commit('addCharacteristic', { characteristic })
  }
}
