export default class ContainerAppCallbacks {
  url: string;
  apiKey: string;  
  
  init(url: string, apiKey: string) {
    this.url = url;
    this.apiKey = apiKey;
  }

  onResume() {
    // tslint:disable-next-line
    console.log(`Starting session, url=${this.url}, api-key=${this.apiKey}`);
  }
  
  onPause() {
    // tslint:disable-next-line
    console.log(`Ending session, url=${this.url}, api-key=${this.apiKey}`);
  }
}