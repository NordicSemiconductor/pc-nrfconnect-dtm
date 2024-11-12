# Configuring and using the application

In the {{app_name}}, you can control the reception and transmission characteristics of the Bluetooth connection through 2-wire UART, in accordance with the [Bluetooth Core specification](https://www.bluetooth.com/specifications/specs/core-specification-5-3/) (volume 6, part F).

!!! info "Tip"
     If you are using an nRF52840 DK or an nRF52833 DK, the {{app_name}} will automatically detect when started if the connected device has the right firmware programmed and will offer to program it.

It is recommended to use two devices for both scenarios:

* **Device 1**: One [supported device](./index.md#supported-devices) programmed with firmware compatible with Direct Test Mode.</br>
  For example, you can use the [Direct Test Mode Bluetooth sample](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/direct_test_mode/README.html) from the nRF Connect SDK.

    !!! note "Note"
          The [Direct Test Mode Bluetooth sample](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/direct_test_mode/README.html) supports two Device Under Test communication protocols: 2-wire UART and experimental HCI UART interface. The {{app_name}} only supports the 2-wire UART.

* **Device 2**: One device programmed with the firmware conformant to the Bluetooth specification.</br>
  This can also be an off-the-shelf product certified for Bluetooth 5.3.

## Transmitting

To execute transmitting, complete the following steps:

1. Connect the **Device 1** to the computer using a USB cable. The device is assigned a `COM` port (Windows), a `ttyACM` device (Linux), or `tty.usbmodem` (macOS), which is visible in the Device Manager.
1. Program or start (or both) the receiver on the **Device 2**.</br>
1. Start the Direct Test Mode app in nRF Connect for Desktop.
1. In the Direct Test Mode app:

    1. Select the supported device programmed with the firmware compatible with Direct Test Mode.
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
    1. Select the **Receiver** tab.
    1. Configure the [receiver settings](overview.md#receiver-tab) to the ones matching the **Device 2**.
    1. Start the test.
    1. On the application chart, observe that the number of RX packets is increasing.
    1. Stop the test.
