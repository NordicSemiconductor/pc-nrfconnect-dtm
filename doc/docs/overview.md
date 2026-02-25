# Overview and user interface

After starting the Direct Test Mode app, the main application window is displayed.

![Direct Test Mode app window](./screenshots/dtm_overview.png "Direct Test Mode app window")

## Common interface

This app uses the nRF Connect for Desktop UI framework. Shared UI elements such as **Select device**, **About** tab, and **Log** panel are described in the [Common user interface](https://docs.nordicsemi.com/bundle/nrf-connect-desktop/page/common_interface.html) documentation.

The available options and information change after you select a device. When you select a device:

* The **Serial port** menu appears, where you can select the port for testing, if you do not want to use the default one.

    ![Serial port menu](./screenshots/dtm_transmitter_serial_port.png "Serial port menu")

* The **Start test** button becomes available in both the **Transmitter** and **Receiver** tab.

## Baud rate

The **Baud rate** drop-down menu lets you select the baud rate used for the test.

![Baud rate menu](./screenshots/dtm_transmitter_baud_rate.png "Baud rate menu")

## Transmitter tab

In **Transmitter** tab, you can configure and test the transmission of the Bluetooth packets and verify the fidelity of the transmission.

Click **Start test** to start transmitting test packets.

![Transmitter tab settings](./screenshots/dtm_transmitter_options.png "Transmitter tab settings")

The available settings are related to the DTM specification.

|       Settings       |       Option        |                                                 Description                                                 |
| -------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Channel mode**     | Single              | Transmit on the specified channel only.                                                                     |
|                      | Sweep               | Transmit in the specified channel range.                                                                    |
| **Channel settings** | Transmit on channel | Channel on which to transmit test packets.                                                                  |
|                      | Transmit power      | Power of the transmission, from -40 dBm to 8 dBm.                                                                                  |
|                      | Transmit period     | Time during which to transmit. Only available for the Sweep mode.                                           |
|                      | Physical layer      | Select the PHY layers on which to transmit test packets.                                                    |
|                      | Packet type         | Select the test pattern for the test packets. `Constant carrier` uses [vendor-specific packet payload](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/direct_test_mode/README.html#vendor-specific_packet_payload).                                                               |
|                      | Packet length       | Select the length of the packet.                                                                            |
|                      | Timeout             | Select the duration of time for which the device under test (DUT) waits for a response from another device. |

## Receiver tab

In the **Receiver** tab, you can configure and test the reception of the Bluetooth packets and verify the fidelity of the reception.

![Receiver tab settings](./screenshots/dtm_receiver_options.png "Receiver tab settings")

Click **Start test** to start receiving test packets.

The available settings are related to the DTM specification.

|       Settings       |       Option       |                                                 Description                                                 |
| -------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Channel mode**     | Single             | Receive on the specified channel only.                                                                      |
|                      | Sweep              | Receive in the specified channel range.                                                                     |
| **Channel settings** | Receive on channel | Channel on which to receive test packets.                                                                   |
|                      | Receive period     | Time during which to receive packets. Only available for the Sweep mode.                                    |
|                      | Physical layer     | Select the PHY layers on which to receive test packets.                                                     |
|                      | Timeout            | Select the duration of time for which the device under test (DUT) waits for a response from another device. |