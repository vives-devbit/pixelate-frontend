import { Store } from 'vuex'
import { EventEmitter } from 'events'

/* tslint:disable:no-console */

// const BluetoothDeviceNamePrefix: string = 'AM1'
const ControllerServiceUuid: string = '83aa3936-2d63-4369-9875-d7b7a20540dd'
const TouchCharacteristicUuid: string = 'ce8ec8f3-b582-4928-9db0-f6626f8b87c9'

const InfoServiceUuid: string = '81bcfa1c-0400-4909-b8e0-9c3311ccbc52'
const IdCharacteristicUuid: string = '79fe0573-3f74-4587-a69d-a2ec6992d220'

export default class BluetoothManager extends EventEmitter {
  private store: Store<any>

  public constructor (store: Store<any>) {
    super()
    this.store = store
  }

  public addDevice () {
    let device: BluetoothDevice
    const requestOptions: RequestDeviceOptions = {
      filters: [{ services: [ControllerServiceUuid] }],
      optionalServices: [ControllerServiceUuid, InfoServiceUuid]
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

        let id = 'no-name'

        server.getPrimaryService(InfoServiceUuid)
          .then((service: BluetoothRemoteGATTService) => {
            console.log('getting characteristic')
            return service.getCharacteristic(IdCharacteristicUuid)
          })
          .then((characteristic: BluetoothRemoteGATTCharacteristic) => {
            return characteristic.readValue()
          })
          .then((data: DataView) => {
            id = (new TextDecoder()).decode(data.buffer)
            this.emit('connected', device, id)

            server.getPrimaryService(ControllerServiceUuid)
              .then((service: BluetoothRemoteGATTService) => {
                console.log('getting characteristic')
                return service.getCharacteristic(TouchCharacteristicUuid)
              })
              .then((characteristic: BluetoothRemoteGATTCharacteristic) => {
                this.storeCharacteristic(characteristic, id)
                console.log(characteristic)
              })
              .catch((error) => {
                console.log(error.message)
                this.emit('error', error.message)
              })
          })
          .catch((error) => {
            console.log(error.message)
            this.emit('error', error.message)
          })
      })
      .catch((error) => {
        console.log(error.message)
        this.emit('error', error.message)
      })
  }

  public startNotifications () {
    const characteristics = this.store.getters.characteristics
    characteristics.forEach((characteristic: BluetoothRemoteGATTCharacteristic, controllerId: string) => {
      characteristic.startNotifications().then(() => {
        characteristic.addEventListener('characteristicvaluechanged', (event: any) => {
          const value = event.target ? event.target.value : 0
          const command = String.fromCharCode(new Int8Array(value.buffer)[0])
          // const controllerId = controller
          this.emit('data', controllerId, command)
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

  private storeCharacteristic (characteristic: BluetoothRemoteGATTCharacteristic, id: string) {
    this.store.commit('addCharacteristic', { characteristic, id })
    console.log(`storing characteristic for ${id}`)
  }
}
