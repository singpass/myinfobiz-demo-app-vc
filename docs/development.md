# Development Guide

## Components

Custom components are written in TypeScript XML and are found under [`./components`](../components/). Components are styled with [`styled-components`](https://www.npmjs.com/package/styled-components).

More on [server-side rendering](https://nextjs.org/docs/advanced-features/react-18/server-components) and [dynamic components](https://nextjs.org/docs/advanced-features/dynamic-import) for Nextjs.

[Migration guide](https://nextjs.org/docs/migrating/incremental-adoption) to Nextjs from React.

## Server-side end points

Server-side API endpoints are found under [`./pages/api`](/pages/api/).

### API Reference

| Endpoint                           | Description                                                        |
| :--------------------------------- | :----------------------------------------------------------------- |
| `GET` `/api/code-challenge`        | Generates session code challenge                                   |
| `POST` `/api/token`                | Generates access token                                             |
| `POST` `/api/vc/code-challenge`    | Calls Corporate VC Code Challenge API                              |
| `POST` `/api/vc/credentials`       | Calls Credentials API to get VC using Signed Code Challenge        |
| `POST` `/api/vc/ether`             | Generates Sign Code Challenge with `VC_ETHEREUM_PRIVATE_KEY`       |
| `POST` `/api/vc/generate`          | Performs composite API calls to request for the generation of a VC |
| `POST` `/api/vc/verify`            | Performs composite API calls to verify a VC                        |
| `POST` `/api/vc/revocation-status` | Performs composite API calls to check revocation status of a VC    |
