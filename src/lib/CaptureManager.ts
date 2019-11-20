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

  private captureState: State;

  public constructor (bluetooth: BluetoothManager) {
    this.bluetooth = bluetooth

    this.bluetooth.on('data', (controller: any, button: any) => {
      console.log(`Controller ${controller} button ${button}`)
      // TODO transmit data from here
    })
    this.captureState = State.Ready
  }

  get state (): State {
    return this.captureState
  }

  public start () {
    this.bluetooth.startNotifications()
    this.captureState = State.Capturing
  }

  public stop () {
    this.bluetooth.stopNotifications()
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
