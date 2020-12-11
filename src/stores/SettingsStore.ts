import { Storage as storage } from '../utils/Storage';
import { makeObservable, observable, action, runInAction } from 'mobx';

export class SettingsStore {
    enableUsageStatistics: boolean = storage.telemetryEnabled();;
    isSavingEnableUsageStatistics: boolean = false;
    deviceName: string = storage.getDeviceName();
    isSavingDeviceName: boolean = false;
    errorMessage: string = "";
    contentFontScale: number = storage.getContentFontScaleFloat();


    constructor() {
        makeObservable(this, {
            enableUsageStatistics: observable, 
            isSavingEnableUsageStatistics: observable,
            deviceName: observable, 
            isSavingDeviceName: observable, 
            errorMessage: observable, 
            contentFontScale: observable, 
            toggleUsageStatistics: action
        })
    }

    toggleUsageStatistics() {
        this.enableUsageStatistics = !this.enableUsageStatistics;
    }

    increaseFontSize() {
        if (this.contentFontScale < 1.5) {
            runInAction(() => this.contentFontScale += 0.1);
            storage.setContentFontScale(this.contentFontScale);
        }
    }

    decreseFontSize() {
        if (this.contentFontScale > 0.7) {
            runInAction(() => this.contentFontScale -= 0.1);
            storage.setContentFontScale(this.contentFontScale);
        }
    }

}
