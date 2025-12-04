# Blink Backend Service (Webhook Handler)

This service is a Serverless Framework application deployed to AWS Lambda. It acts as the primary entry point for external webhooks.

## Architecture
- **Runtime:** Node.js 20.x
- **Infrastructure:** AWS Lambda + API Gateway (HTTP API)
- **Deployment:** GitHub Actions (CI/CD)

## Project Structure
```bash
backend/
├── src/
│   └── receiver.js    # Main Webhook Handler (Validation & Logic)
├── serverless.yml     # AWS Infrastructure Config
└── package.json       # Dependencies & Metadata
````

## Environment Variables

The following secrets are required for deployment (set in GitHub Secrets):

  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `WEBHOOK_SECRET`: Secret key for validating incoming webhook signatures.

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Deploy manually (optional):
    ```bash
    serverless deploy
    ```
