# {{app_name}}

The {{app_name}} in nRF Connect for Desktop provides a graphical UI for the Direct Test Mode (DTM) commands through 2-wire UART. The DTM is a Bluetooth® test framework used for performing RF PHY testing of Bluetooth Low Energy devices and ensuring interoperability of the Bluetooth devices.

You can use the {{app_name}} to control the following features of the radio:

- Set transmission power and receiver sensitivity
- Set frequency offset and drift
- Set modulation characteristics
- Verify packet error rate
- Set intermodulation performance

See the [Bluetooth Core specification](https://www.bluetooth.com/specifications/specs/core-specification-5-3/) (volume 6, part F) for more information about the DTM requirements.

!!! tip "Important"
      The {{app_name}} cannot be used as a testing or certification tool. This is because it only provides a graphical wrapper around DTM commands for the Upper Tester. For verification using both the Upper Tester and the Lower Tester, you need an external tester equipment. For example, in case of the [Direct Test Mode Bluetooth sample](https://docs.nordicsemi.com/bundle/ncs-latest/page/nrf/samples/bluetooth/direct_test_mode/README.html), this can be the Anritsu MT8852 or similar, in which case you obtain the following configuration:

      ![Testing setup for the Direct Test Mode Bluetooth sample](./screenshots/bt_dtm_dut.svg "Testing setup for the Direct Test Mode Bluetooth sample")

The {{app_name}} is installed and updated using [nRF Connect for Desktop](https://docs.nordicsemi.com/bundle/nrf-connect-desktop/page/index.html) (v4.4.1 or later).

## Supported devices

- nRF52840 DK
- nRF52833 DK (nRF52 DK)

The application also supports third-party devices that are programmed with the DTM standard protocol and expose access to it through a serial port.