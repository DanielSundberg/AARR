export default class ContainerAppCallbacks {
    startSession(url: string, apiKey: string) {
      // tslint:disable-next-line
      console.log(`Starting session, url=${url}, api-key=${apiKey}`);
    }
    endSession(url: string, apiKey: string) {
      // tslint:disable-next-line
      console.log(`Ending session, url=${url}, api-key=${apiKey}`);
    }
  }