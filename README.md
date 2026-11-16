# Node.js API Monitoring Server

A Node.js HTTP server that validates incoming request headers and monitors API traffic using [HeaderGauge](https://www.npmjs.com/package/headergauge).

## Features

- Validates incoming HTTP request headers.
- Rejects oversized headers with HTTP 431.
- Tracks accepted and rejected requests.
- Monitors total incoming header size.
- Provides API endpoints for health checks, sample data, and monitoring statistics.

## Tech Stack

- Node.js
- Built-in HTTP module
- HeaderGauge npm package

## Installation

Clone this repository and install dependencies:

```bash
npm install
```

## Start the server

```bash
npm start
```

Server runs at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |
| GET | `/api/data` | Retrieve sample data |
| GET | `/api/stats` | View request monitoring statistics |

## Header Validation

HeaderGauge analyzes every incoming request before route processing.

- Maximum total header size: 512 bytes
- Maximum individual header size: 256 bytes

Requests exceeding these limits receive HTTP `431 Request Header Fields Too Large`.

## Test Oversized Headers

```bash
curl -i -H "X-Large-Test: $(python3 -c 'print("A"*600)')" http://localhost:3000/api/data
```

## View Monitoring Statistics

```bash
curl http://localhost:3000/api/stats
```

## How HeaderGauge Is Used

The application imports `analyzeHeaders()` from HeaderGauge and uses its analysis result in the HTTP server's request-handling logic to enforce header size limits and collect monitoring statistics.

## License

MIT