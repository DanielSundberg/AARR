export const telemetryEnabled = (): boolean => {
    return localStorage.getItem('enableTelemetry') === "true";
};

export const getUserId = (): string => {
    return localStorage.getItem('userId') || "";
};

export const getDeviceId = (): string => {
    return localStorage.getItem('deviceId') || "";
};

export const getDeviceName = (): string => {
    return localStorage.getItem('deviceName') || "";
};

export const getAuthToken = (): string => {
    return localStorage.getItem('authToken') || "";
};

export const setAuthToken = (token: string) => {
    return localStorage.setItem('authToken', token);
};

export const clearAuthToken = () => {
    localStorage.removeItem("authToken");
};

export const setDeviceName = (deviceName: string) => {
    localStorage.setItem('deviceName', deviceName);
};

export const setEnableTelemetry = (enabled: boolean) => {
    localStorage.setItem('enableTelemetry', enabled ? "true" : "false");
};

export const setUserId = (userId: string) => {
    localStorage.setItem('userId', userId);
};

export const setDeviceId = (deviceId: string) => {
    localStorage.setItem('deviceId', deviceId);
};

export const getContentFontScaleFloat = () => {
    return parseFloat(localStorage.getItem('contentFontScale') || "1.0");
};

// tslint:disable-next-line
export const setContentFontScale = (contentFontScale: any) => {
    localStorage.setItem('contentFontScale', contentFontScale.toString());
};

export const getTheme = (defaultValue: string): string => {
    return localStorage.getItem("theme") || defaultValue;
};

export const storeTheme = (key: string) => {
    localStorage.setItem("theme", key);
};

export const setItem = (key: string, val: string) => {
    localStorage.setItem(key, val);
};

export const getItem = (key: string): string => {
    return localStorage.getItem(key) || "";
};
