declare namespace NodeJS {
  export interface ProcessEnv {
    readonly VC_ETHEREUM_PRIVATE_KEY: string;
    readonly VC_ETHEREUM_WALLET_ADDRESS: string;

    readonly CLIENT_PRIVATE_SIGNING_KEY: string;
    readonly CLIENT_PRIVATE_ENCRYPTION_KEY: string;

    readonly NEXT_PUBLIC_SINGPASS_ENV: string;
    readonly NEXT_PUBLIC_DEMO_APP_CLIENT_ID: string;
    readonly NEXT_PUBLIC_DEMO_APP_CALLBACK_URL: string;
    readonly NEXT_PUBLIC_DEMO_APP_PURPOSE_ID: string;
    readonly NEXT_PUBLIC_DEMO_APP_SCOPES: string;
  }
}
