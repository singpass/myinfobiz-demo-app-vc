# Development Guide

## Prerequisites

Before starting development, please ensure that you've read [`initial setup`](/README.md#initial-setup) guide.

To get started on setting up your ethereum wallet, please read the [ethereum guide](ethereum.md).

## Components

Custom components are written in TypeScript XML and are found under [`./components`](../components/). Components are styled with [`styled-components`](https://www.npmjs.com/package/styled-components).

More on [server-side rendering](https://nextjs.org/docs/advanced-features/react-18/server-components) and [dynamic components](https://nextjs.org/docs/advanced-features/dynamic-import) for Nextjs.

[Migration guide](https://nextjs.org/docs/migrating/incremental-adoption) to Nextjs from React.

## Server-side end points

Server-side API endpoints are found under [`./pages/api`](/pages/api/).

### API Reference

| Endpoint                                                                        | Description                                                                              |
| :------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------------- |
| `GET` [`/api/codeChallenge`](/pages/api/codeChallenge.ts)                       | Generates session code challenge                                                         |
| `POST` [`/api/token`](/pages/api/token.ts)                                      | Generates access token                                                                   |
| `POST` [`/api/vc/codeChallenge`](/pages/api/vc/codeChallenge/index.ts)          | Calls Corporate VC Code Challenge API                                                    |
| `POST` [`/api/vc/credentials`](/pages/api/vc/credentials.ts)                    | Calls Credentials API to get VC using Signed Code Challenge                              |
| `POST`&nbsp;[`/api/vc/codeChallenge/sign`](/pages/api/vc/codeChallenge/sign.ts) | Generates Sign Code Challenge with&nbsp;[`VC_ETHEREUM_PRIVATE_KEY`](/.env.local.example) |
| `POST` [`/api/vc/generate`](/pages/api/vc/generate.ts)                          | Performs composite API calls to request for the generation of a VC                       |
| `POST` [`/api/vc/verify`](/pages/api/vc/verify.ts)                              | Performs composite API calls to verify a VC                                              |
| `POST` [`/api/vc/revocationStatus`](/pages/api/vc/revocationStatus.ts)          | Performs composite API calls to check revocation status of a VC                          |
