# Secure Casdoor setup

The Docker Compose stack intentionally does not include a Casdoor private key or certificate.

Before starting the stack:

1. Create a Casdoor initialization export for your own deployment.
2. Generate a new signing certificate and private key in that Casdoor instance.
3. Save the export as `init_data.local.json` in this directory.
4. Set every `REPLACE_WITH_*` value in your local `.env` file.

`init_data.local.json` is ignored by Git and must never be committed. If any previously published development key was used outside a disposable local environment, revoke or rotate it before deployment.
