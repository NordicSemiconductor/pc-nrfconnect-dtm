import { NrfConnectState } from 'pc-nrfconnect-shared';

export interface DeviceState {
    serialNumber: string | null;
    dtm: null;
    board: string | null;
    isReady: boolean;
}

export interface SettingsState {
    channelMode: string;
    singleChannel: number;
    channelRange: number[];
    sweepTime: number;
    bitpattern: number;
    length: number;
    txPower: number;
    phy: number;
    modulationMode: number;
    timeoutms: number;
}

export interface TestState {
    isRunning: boolean;
    lastStatusMessage: string;
    lastReceived: Array<number>;
    currentChannel: number | undefined;
    lastChannel: {
        channel: number;
        received: number;
    };
    update: number;
}

export interface WarningState {
    compatibleDeviceWarning: string;
    communicationError: string;
}

interface AppState {
    device: DeviceState;
    settings: SettingsState;
    test: TestState;
    warning: WarningState;
}

export type RootState = NrfConnectState<AppState>;
