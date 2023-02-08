export default {
  header: "A Singapore Government Agency Website",
  title: "Verifiable Credential Sample App",
  subtitle:
    "Select request or verify to test out Corporate Verifiable user flow.",
  button: {
    request: "Request",
    verify: "Verify",
    resetVerify: "Reset",
    ok: "Ok",
    copy: "Copy to clipboard",
    loading: "Loading...",
  },
  request: {
    tabButton: "Request for a Corporate VC",
    title: "Corporate Verifiable Credential Configuration",
    notice: "You will be directed to Corppass to retrieve your Corporate data.",
    step1: "Generating unique Tokens",
    step2: "Getting your Code Challenge with your Ethereum Address",
    step3: "Signing Code Challenge with your Ethereum Private Keys",
    step4: "Retrieving Verifiable Credential",
    response: {
      title: "Your Corporate Verifiable Credential",
      successBanner:
        "Request for a Corporate Verifiable Credential is successful.",
      reset: "You can {{ link }} now.",
      link: "verify your Corporate Verifiable Credential",
      failed: {
        getSignedCodeChallenge: "Failed to get signed Code Challenge",
        codeChallenge: "Failed to get Code Challenge",
        verifyCodeChallenge: "Failed to verify Code Challenge",
        verifyEthereumAddress: "Failed to verify Ethereum Address",
        getMyInfoData: "Failed to get MyInfo data",
        getVc: "Failed to get Corporate Verifiable Credential",
      },
    },
  },
  verify: {
    tabButton: "Verify a Corporate VC",
    title: "Corporate Verifiable Credential",
    subtitle: "Paste your Corporate VC to verify",
    step1: "Resolve DID Documents",
    step2: "Verifying your VC",
    step3: "Getting your revocation list",
    step4: "Verifying your VC revocation status",
    response: {
      successBanner:
        "Corporate Verifiable Credential verification is successful.",
      failedBanner: "Invalid Corporate Verifiable Credential",
    },
  },
  dialog: {
    title: {
      request: "Requesting...",
      verify: "Verifying...",
      success: "Successful",
      failed: "Unsuccessful",
    },
  },
  copySuccess: "Text copied",
};
