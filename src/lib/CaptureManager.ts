import BluetoothManager from './BluetoothManager'

export enum State {
  Ready,
  Capturing,
  Stopped,
  Saving,
  Saved,
  SaveError,
}

export default class CaptureManager {
  private bluetooth: BluetoothManager

  private captureState: State
  private socket: any

  public constructor (bluetooth: BluetoothManager, socket: any) {
    this.bluetooth = bluetooth
    this.socket = socket

    this.bluetooth.on('data', (controller: any, button: any) => {
      console.log(`Controller ${controller} button ${button}`)
      // TODO transmit data from here
      let updates = [
        { id: controller, actions: [button] }
      ]
      this.socket.emit('update', JSON.stringify(updates))
    })
    this.captureState = State.Ready
    this.bluetooth.startNotifications()
  }

  get state (): State {
    return this.captureState
  }

  public start () {
    this.captureState = State.Capturing
  }

  public stop () {
    // this.bluetooth.stopNotifications()
    this.captureState = State.Stopped
  }

  public addLabel (label: string) {
    // this.recorder.addLabel(label)
  }

  public getSampleCount () {
    // return this.recorder.measurement.samples.length
  }

  public getLabelCount () {
    // return this.recorder.measurement.labels.length
  }
}
