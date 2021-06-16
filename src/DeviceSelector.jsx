import { connect } from 'react-redux';
import path from 'path';
import { DeviceSelector, getAppDir, logger } from 'pc-nrfconnect-shared';

import { deselectDevice, selectDevice } from './actions/testActions';
import { deviceDeselected } from './reducers/deviceReducer';
import { clearAllWarnings } from './reducers/warningReducer';
import { compatiblePCAs } from './utils/constants';

const portPath = serialPort => serialPort.path || serialPort.comName;

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
};

const mapStateToProps = () => ({
    deviceListing,
    deviceSetup,
});

function mapDispatchToProps(dispatch) {
    return {
        onDeviceSelected: device => {
            const { serialNumber, boardVersion } = device;
            dispatch(clearAllWarnings());
            if (compatiblePCAs.includes(boardVersion)) {
                logger.info(
                    `Validating firmware for device with s/n ${serialNumber}`
                );
            }
        },
        onDeviceDeselected: () => {
            dispatch(deselectDevice());
            dispatch(deviceDeselected());
            dispatch(clearAllWarnings());
        },
        onDeviceIsReady: device => {
            const { serialport: port, boardVersion } = device;
            logger.info('Device selected successfully');
            dispatch(selectDevice(portPath(port), boardVersion));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceSelector);
