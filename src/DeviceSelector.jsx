import { connect } from 'react-redux';
import path from 'path';
import { DeviceSelector, getAppDir } from 'pc-nrfconnect-shared';

const deviceListing = {
    serialport: true,
    jlink: true,
};

const deviceSetup = {
    jprog: {
        pca10040: {
            fw: path.resolve(
                getAppDir(),
                'firmware/direct_test_mode_pca10040.hex'
            ),
            fwVersion: 'dtm-fw-1.0.0',
            fwIdAddress: 0x6000,
        },
        pca10056: {
            fw: path.resolve(
                getAppDir(),
                'firmware/direct_test_mode_pca10056.hex'
            ),
            fwVersion: 'dtm-fw-1.0.0',
            fwIdAddress: 0x6000,
        },
    },
    allowCustomDevice: true,
};

const mapStateToProps = () => ({
    deviceListing,
    deviceSetup,
});

function mapDispatchToProps(dispatch) {
    return {
        onDeviceSelected: device => {},
        onDeviceDeselected: () => {},
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSelector);

/*
mapDeviceSelectorState: (state, props) => ({
    portIndicatorStatus:
        state.app.device.serialNumber !== null ? 'on' : 'off',
    ...props,
}),

    middleware: store => next => async action => {
        const { dispatch } = store;
        const { type, device } = action;
        const nextAction = { ...action };

        switch (type) {
            case 'DEVICES_DETECTED': {
                const ports = await SerialPort.list();
                const com1 = ports.find(p => portPath(p) === 'COM1');
                if (com1 != null) {
                    const com1Device = {
                        boardVersion: undefined,
                        serialNumber: 'COM1',
                        serialport: com1,
                        traits: ['serialport'],
                    };
                    nextAction.devices = [com1Device, ...action.devices];
                }
                break;
            }

            case 'DEVICE_SELECTED': {
                const { serialNumber, boardVersion } = device;
                dispatch(clearAllWarnings());
                if (compatiblePCAs.includes(boardVersion)) {
                    logger.info(
                        `Validating firmware for device with s/n ${serialNumber}`
                    );
                }
                break;
            }

            case 'DEVICE_SETUP_INPUT_REQUIRED': {
                nextAction.message =
                    'In order to use this application you need a firmware ' +
                    'that supports Direct Test Mode. ' +
                    'You may use the provided pre-compiled firmware or your own. ' +
                    'Would you like to program the pre-compiled firmware to the device?';
                break;
            }

            case 'DEVICE_SETUP_COMPLETE': {
                const { serialport: port, boardVersion } = device;
                logger.info('Device selected successfully');
                dispatch(selectDevice(portPath(port), boardVersion));
                break;
            }

            case 'DEVICE_SETUP_ERROR': {
                const { serialport: port, boardVersion } = device;
                if (action.error && action.error.message) {
                    logger.info(action.error.message);
                }
                logger.info(
                    'Please make sure the device has been programmed' +
                    ' with a supported firmware'
                );
                dispatch(selectDevice(portPath(port), boardVersion));
                break;
            }

            case 'DEVICE_DESELECTED':
                dispatch(deselectDevice());
                dispatch(clearAllWarnings());
                break;

            default:
        }

        next(nextAction);
    },

    // Prefer to use the serialport 8 property or fall back to the serialport 7 property
const portPath = serialPort => serialPort.path || serialPort.comName;
*/
