# App Configuration Guide

Please read the [`initial setup`](/README.md#initial-setup) guide before refering to the following.

To get started on setting up your ethereum wallet, please read the [ethereum guide](ethereum.md).

## Environment Variables

Environment variables underlined in [`.env.local`](/.env.local.example) are required for the app to run successfully. [`.env.local`](/.env.local.example) has to be located in the project root in order for Nextjs to loader to pickup.

There are 2 types of environment variables to be loaded on the app. The frontend client will **_only_** load the environment variables prefixed with `NEXT_PUBLIC_`.

Environment variables loads during build time and any unused environment variables will not be loaded for security purposes.

### Reference

> _\***Disclaimer:** all ethereum wallet addresses and private keys listed as examples are publicly available and should NOT be used for any other purposes other than for the demonstration of this app._
>
> _**Note:** The following example Ethereum Wallet Address and Private Keys do not match. Please generate your own Ethereum Wallet Address and Private keys if you wish to use this app for testing. You may refer to the [Ethereum Guide](ethereum.md) for more details on how to generate one._

| Environment Variables               | Description                                                                                                                                                              |
| :---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VC_ETHEREUM_WALLET_ADDRESS`:       | Your Ethereum Wallet address. See [how to create an Ethereum wallet](ethereum.md#creating-wallet-address).<br/>Example: `"0xb794f5ea0ba39494ce839613fffba74279579268"`\* |
| `VC_ETHEREUM_PRIVATE_KEY`           | Generation of an Ethereum key based on the elliptical curve ecp256k1.<br/>Example:&nbsp;`"afdfd9c3d2095ef696594f6cedcae59e72dcd697e2a7521b1578140422a4f890"`\*           |
| `CLIENT_PRIVATE_SIGNING_KEY`        | Location of your signing key.<br/>Example: `"./cert/your-sample-app-signing-private-key.pem"`                                                                            |
| `CLIENT_PRIVATE_ENCRYPTION_KEY`     | Location of your encryption key.<br/>Example: `"./cert/your-sample-app-encryption-private-key.pem"`                                                                      |
| `NEXT_PUBLIC_SINGPASS_ENV`          | Environment to run this app on.<br/>Example: `"test"`                                                                                                                    |
| `NEXT_PUBLIC_DEMO_APP_CLIENT_ID`    | Valid Client ID of the app.<br/>Example: `"STG2-MYINFO-SELF-TEST"`                                                                                                       |
| `NEXT_PUBLIC_DEMO_APP_CALLBACK_URL` | A URL for Singpass to callback when authorization is successful.<br/>Example: `"http://localhost:3001/callback"`                                                         |
| `NEXT_PUBLIC_DEMO_APP_PURPOSE_ID`   | Valid Purpose ID of the app.<br/>Example: `"demonstration"`                                                                                                              |
| `NEXT_PUBLIC_DEMO_APP_SCOPES`       | Valid scopes of the app.<br/>Example: `"corporatebasiccredential"`                                                                                                       |

## Other Configurations

#### [`./config`](/config/) Directory

- [**`app.ts`**](/config/app.ts): stores the configuration object for the client side of the app.
- [**`locale.ts`**](/config/locale.ts): stores the configuration object for all generated text of the app.
- [**`myinfo.ts`**](/config/myinfo.ts): stores the configuration object for `myinfo-connector`.
- [**`shown.ts`**](/config/shown.ts): stores the configuration object to be displayed when user visits the app home at `/`.

#### [`./public`](/public/) Directory

Stores all the static assets of the app, see nextjs guide on [static file serving](https://nextjs.org/docs/basic-features/static-file-serving).

#### [`./lib`](/lib/) Directory

Contains the interfaces for the custom libraries required.
