import { AppUsageResource } from './AppUsageResource';

export default class ContainerAppCallbacks {
    appUsageResource: AppUsageResource;

    init(url: string, apiKey: string) {
        this.appUsageResource = new AppUsageResource(url, apiKey);
    }

    async onResume() {
        if (this.appUsageResource) {
            this.appUsageResource.startSession();
        }
    }

    async onPause() {
        if (this.appUsageResource) {
            this.appUsageResource.endSession();
        }
    }
}