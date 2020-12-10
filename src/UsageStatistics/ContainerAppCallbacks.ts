import { AppUsageResource } from './AppUsageResource';

export default class ContainerAppCallbacks {
    appUsageResource: AppUsageResource;

    init(url: string, apiKey: string) {
        this.appUsageResource = new AppUsageResource(url, apiKey);
    }

    async onResume() {
        // Telemetry disabled for now
        // if (this.appUsageResource) {
        //     this.appUsageResource.startSession();
        // }
    }

    async onPause() {
        // Telemetry disabled for now
        // if (this.appUsageResource) {
        //     this.appUsageResource.endSession();
        // }
    }
}