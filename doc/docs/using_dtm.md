# Configuring and using the application

In the Direct Test Mode app, you can control the reception and transmission characteristics of the Bluetooth® connection through 2-wire UART, in accordance with the [Bluetooth Core specification, volume 6, part F](https://www.bluetooth.com/wp-content/uploads/Files/Specification/HTML/Core-61/out/en/low-energy-controller/direct-test-mode.html).

It is recommended to use two devices for both scenarios:

* **Device 1**: One device programmed with firmware compatible with Direct Test Mode.</br>
  See [Supported device](./index.md#supported-devices) for more information.

* **Device 2**: One device programmed with the firmware conformant to the Bluetooth specification.</br>
  This can also be an off-the-shelf product certified for Bluetooth Core 5.3.

## Transmitting

To execute transmitting, complete the following steps:

1. Connect the **Device 1** to the computer using a USB cable. The device is assigned a `COM` port (Windows), a `ttyACM` device (Linux), or `tty.usbmodem` (macOS), which is visible in the Device Manager.
1. Program or start (or both) the receiver on the **Device 2**.</br>
1. Start the Direct Test Mode app in nRF Connect for Desktop.
1. In the Direct Test Mode app:

    1. Select the supported device programmed with the firmware compatible with Direct Test Mode.
    1. Optionally, select the [**Serial port**](https://docs.nordicsemi.com/bundle/swtools_docs/page/common_interface.html#options-for-the-selected-device) from the drop-down menu.<br/>The selection should match the port assigned in the Device Manager.
    1. Optionally, select the [**Baud rate**](overview.md#baud-rate) for the connection.
    1. Select the **Transmitter** tab.
    1. Configure the [transmitter settings](overview.md#transmitter-tab) to the ones matching the **Device 2**.
    1. Start the test.
    1. On the application chart, observe that the number of TX packets is increasing.
    1. Stop the test.

## Receiving

To execute receiving, complete the following steps:

1. Connect the **Device 1** to the computer using a USB cable. The device is assigned a `COM` port (Windows), a `ttyACM` device (Linux), or `tty.usbmodem` (macOS), which is visible in the Device Manager.
1. Program or start (or both) the transmitter on the **Device 2**.</br>
1. Start the Direct Test Mode app in nRF Connect for Desktop.
1. In the Direct Test Mode app:

    1. Select the supported device programmed with the firmware compatible with Direct Test Mode.
    1. Optionally, select the [**Serial port**](https://docs.nordicsemi.com/bundle/swtools_docs/page/common_interface.html#options-for-the-selected-device) from the drop-down menu.<br/>The selection should match the port assigned in the Device Manager.
    1. Optionally, select the [**Baud rate**](overview.md#baud-rate) for the connection.
    1. Select the **Receiver** tab.
    1. Configure the [receiver settings](overview.md#receiver-tab) to the ones matching the **Device 2**.
    1. Start the test.
    1. On the application chart, observe that the number of RX packets is increasing.
    1. Stop the test.
