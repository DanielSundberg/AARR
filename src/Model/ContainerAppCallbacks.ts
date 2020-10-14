export default class ContainerAppCallbacks {
    onResume(apiKey: string) {
      // tslint:disable-next-line
      alert(`Resuming, api key=${apiKey}`);
    }
    onPause(apiKey: string) {
      // tslint:disable-next-line
      alert(`Pausing, api key=${apiKey}`);
    }
  }