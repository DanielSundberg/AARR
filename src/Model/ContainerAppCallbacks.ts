export default class ContainerAppCallbacks {
    onResume(): void {
      // tslint:disable-next-line
      console.log("Resuming!");
    }
    onPause(): void {
      // tslint:disable-next-line
      console.log("Pausing");
    }
  }