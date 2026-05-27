> **Repository scope:** Hardware design and BOM details may later be published under **Apache 2.0** (firmware) or **CERN-OHL-S** (hardware designs) per the WATT licensing matrix. This document is retained here for **prototype context** alongside the MIT smart-contract repo; treat licensing for reproduction separately.

# WATT Smart Meter Gen 1 — Hardware Specifications

## Overview
The WATT Smart Meter is a compact IoT device that attaches to any 
solar panel, wind turbine, or clean energy inverter. It measures 
energy generation in real time and transmits verified data to the 
blockchain every 15 minutes via cryptographic signing.

## Components

| Component | Cost | Source |
|---|---|---|
| Raspberry Pi Zero 2W | $15 | raspberrypi.com |
| PZEM-004T AC Energy Sensor | $8 | AliExpress |
| DS3231 Real-Time Clock | $3 | AliExpress |
| SIM800L GSM Module | $6 | AliExpress |
| MicroSD Card 16GB | $5 | Any store |
| 0.96 inch OLED Display | $4 | AliExpress |
| IP65 Weatherproof Enclosure | $10 | AliExpress |
| Misc components | $5 | Local |
| TOTAL PROTOTYPE COST | ~$56 USD | |

## Technical Specifications

| Spec | Detail |
|---|---|
| Voltage Range | 80V to 260V AC and 12V to 48V DC |
| Frequency | 50Hz and 60Hz universal |
| Accuracy | Class 1 plus or minus 1 percent |
| Data Cadence | Every 15 minutes committed on-chain |
| Connectivity | WiFi 2.4GHz and GSM/4G global SIM |
| Dimensions | 12cm x 8cm x 4cm |
| Weather Rating | IP65 weatherproof |
| Installation Time | Under 30 minutes, no rewiring required |

## Standards Compliance
- IEC 62053 International energy metering standard
- ANSI C12 North America energy metering standard
- Compatible with all major solar inverter brands
- Works with 50Hz and 60Hz electrical systems globally

## How It Works
1. Meter attaches to solar panel or inverter output
2. PZEM-004T sensor reads energy output in real time
3. Raspberry Pi processes and cryptographically signs the data
4. Every 15 minutes data is transmitted via WiFi or GSM
5. Chainlink oracle receives and verifies the data
6. Smart contract mints 1 WATT token per verified KWh
7. Tokens arrive in producer wallet automatically

## Current Status
Prototype assembled and tested in Kaduna, Nigeria.
Energy sensor successfully reading and logging live data.
Blockchain data pipeline tested end to end on Base Sepolia testnet.

## License
MIT License — hardware design open source for community replication
by any government, NGO, or community worldwide.
