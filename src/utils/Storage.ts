const telemetryEnabled = (): boolean => {
    return localStorage.getItem('enableTelemetry') === "true";
};

const getUserId = (): string => {
    return localStorage.getItem('userId') || "";
};

const getDeviceId = (): string => {
    return localStorage.getItem('deviceId') || "";
};

const getDeviceName = (): string => {
    return localStorage.getItem('deviceName') || "";
};

const getAuthToken = (): string => {
    return localStorage.getItem('authToken') || "";
};

const setAuthToken = (token: string) => {
    return localStorage.setItem('authToken', token);
};

const clearAuthToken = () => {
    localStorage.removeItem("authToken");
};

const setDeviceName = (deviceName: string) => {
    localStorage.setItem('deviceName', deviceName);
};

const setEnableTelemetry = (enabled: boolean) => {
    localStorage.setItem('enableTelemetry', enabled ? "true" : "false");
};

const setUserId = (userId: string) => {
    localStorage.setItem('userId', userId);
};

const setDeviceId = (deviceId: string) => {
    localStorage.setItem('deviceId', deviceId);
};

const getContentFontScaleFloat = () => {
    return parseFloat(localStorage.getItem('contentFontScale') || "1.0");
};

// tslint:disable-next-line
const setContentFontScale = (contentFontScale: any) => {
    localStorage.setItem('contentFontScale', contentFontScale.toString());
};

const getTheme = (defaultValue: string): string => {
    return localStorage.getItem("theme") || defaultValue;
};

const storeTheme = (key: string) => {
    localStorage.setItem("theme", key);
};

const setItem = (key: string, val: string) => {
    localStorage.setItem(key, val);
};

const getItem = (key: string): string => {
    return localStorage.getItem(key) || "";
};

export const Storage = {
    telemetryEnabled,
    getUserId,
    getDeviceId,
    getDeviceName,
    getAuthToken,
    setAuthToken,
    clearAuthToken,
    setDeviceName,
    setEnableTelemetry,
    setUserId,
    setDeviceId,
    getContentFontScaleFloat,
    setContentFontScale,
    getTheme,
    storeTheme,
    getItem,
    setItem
};
