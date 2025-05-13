## 2.5.0 - 2025-05-14

### Added

-   Drop-down menu for changing the baud rate in order to use custom firmwares.

### Changed

-   Update dependencies to support the nRF Connect for Desktop v5.2.0 release.
-   nRF54L15 DK: Only valid Transmit Power values (-8 dBm to 8 dBm) are now
    displayed.

### Fixed

-   Issue where the Transmit Power slider would disallow setting valid values.

## 2.4.2 - 2024-11-11

### Changed

-   Updated `nrfutil device` to v2.6.4.

## 2.4.1 - 2024-05-21

### Added

-   Support for Apple silicon.

### Fixed

-   Sweep mode in some cases wasn't using the selected channels.
-   Transmit power was sometimes set to an invalid value when selecting the
    nRF52 DK.

## 2.4.0 - 2024-04-09

### Changed

-   Integrated the functionality of the Feedback tab in the **Give Feedback**
    dialog in the About tab.

## 2.3.1 - 2024-03-25

### Fixed

-   Channel selection on the side panel did not match the chart.

## 2.3.0 - 2024-03-13

### Added

-   Persist state of the Show Log panel.
-   Feedback tab.

### Changed

-   Updated `nrfutil device` to v2.1.1.

### Fixed

-   Number input controls using `Up` and `Down` keyboard keys now work as
    expected.
-   The Transmit channel range on Sweep Mode no longer affects the validation of
    the Transmit channel on the Single mode.

## 2.2.0 - 2023-12-07

### Changed

-   From **nrf-device-lib-js** to **nrfutil device**, as a backend for
    interacting with devices.

## 2.1.0 - 2023-04-03

### Added

-   Port selection for devices with multiple serial ports.
-   Selected ports are persisted per device.

### Fixed

-   While receiving in sweep mode, the transmitter tab wrongly showed a sweep
    pattern. Now the tab of the non-active mode states that only the other tab
    shows results.
-   Devices were sometimes mistakenly detected as having readback protection.

## 2.0.4 - 2023-02-13

### Changed

-   Increased required nRF Connect for Desktop version to v4.0.0.
-   If the firmware is wrong and the device is readback protected, offer a
    solution that recovers the device.

## 2.0.3 - 2022-09-05

### Changed

-   Increased required nRF Connect for Desktop version to 3.12.

## 2.0.2 - 2022-21-04

### Fixed

-   DTM did not display all serial port devices.

## 2.0.1 - 2022-01-04

### Fixed

-   Device busy error after de- and reselecting a device.

### Changed

-   New icon.

## 2.0.0 - 2021-11-01

### Changed

-   Establish compatibility with nRF Connect for Desktop 3.8
-   New UI design.
-   Split Transmitter and Receiver into seperate panes.
-   Timeout updates UI after completion.

## 1.1.7 - 2021-02-22

### Removed

-   Live view of captured packets in receive mode. Packets are only displayed in
    the UI after sampling has stopped.

## 1.1.6 - 2020-11-27

### Fixed

-   Constant carrier for transmitter.

## 1.1.5 - 2020-09-16

### Changed

-   Enable constant carrier for transmitter.

## 1.1.4 - 2020-07-08

### Fixed

-   Not showing a graph when selecting -40 dBm output.
-   Tooltip value when hovering over the TX bar.

## 1.1.3 - 2020-06-09

### Added

-   Support for custom firmware with Nordic device.

## 1.1.2 - 2020-05-04

### Changed

-   Allow 2Mb phy for unknown devices.

## 1.1.1

### Fixed

-   Avoid programming custom devices.

## 1.1.0 - 2020-01-15

### Added

-   Support custom devices and custom firmware.
-   Support for physical serial port on Windows.

## 1.0.0 - 2020-01-08

-   Initial public release.
