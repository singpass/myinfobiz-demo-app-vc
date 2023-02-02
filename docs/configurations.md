# App Configuration Guide

Please read the [`initial setup`](/README.md#initial-setup) guide before refering to the following.

## [`.env.local`](/.env.local.example) File

Environment variables underlined in [`.env.local`](/.env.local.example) are required for the app to run successfully. [`.env.local`](/.env.local.example) has to be located in the project root in order for Nextjs to loader to pickup.

There are 2 types of environment variables to be loaded on the app. The frontend client will **_only_** load the environment variables prefixed with `NEXT_PUBLIC_`.

Environment variables loads during build time and any unused environment variables will not be loaded for security purposes.

### Reference

|        Environment Variable         | Example                                                            | Description                                                                                                |
| :---------------------------------: | :----------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- |
|    `VC_ETHEREUM_WALLET_ADDRESS`     | "0xb794f5ea0ba39494ce839613fffba74279579268"                       | Your Ethereum Wallet address. See [how to create an Ethereum wallet](ethereum.md#creating-wallet-address). |
|      `VC_ETHEREUM_PRIVATE_KEY`      | "afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890" | Generation of an Ethereum key based on the elliptical curve ecp256k1                                       |
|    `CLIENT_PRIVATE_SIGNING_KEY`     | "./cert/your-sample-app-signing-private-key.pem"                   | Location of your signing key.                                                                              |
|   `CLIENT_PRIVATE_ENCRYPTION_KEY`   | "./cert/your-sample-app-encryption-private-key.pem"                | Location of your encryption key.                                                                           |
|     `NEXT_PUBLIC_SINGPASS_ENV`      | "test"                                                             | Environment to run this app on.                                                                            |
|  `NEXT_PUBLIC_DEMO_APP_CLIENT_ID`   | "STG2-MYINFO-SELF-TEST"                                            | Valid Client ID of the app.                                                                                |
| `NEXT_PUBLIC_DEMO_APP_CALLBACK_URL` | "http://localhost:3001/callback"                                   | A URL for Singpass to callback when authorization is successful.                                           |
|  `NEXT_PUBLIC_DEMO_APP_PURPOSE_ID`  | "demonstration"                                                    | Valid Purpose ID of the app.                                                                               |
|    `NEXT_PUBLIC_DEMO_APP_SCOPES`    | "corporatebasiccredential"                                         | Valid scopes of the app.                                                                                   |

## [`./config`](../config/) Directory

- [**`app.ts`**](../config/app.ts): stores the configuration object for the client side of the app.
- [**`locale.ts`**](../config/locale.ts): stores the configuration object for all generated text of the app.
- [**`myinfo.ts`**](../config/myinfo.ts): stores the configuration object for `myinfo-connector`.
- **`shown.ts`**: stores the configuration object to be displayed when user visits the app home at `/`.

## [`./public`](/public/) Directory

Stores all the static assets of the app, see nextjs guide on [static file serving](https://nextjs.org/docs/basic-features/static-file-serving).

## [`./lib`](/lib/) Directory

Contains the interfaces for the custom libraries required.
