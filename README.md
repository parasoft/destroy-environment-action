<p align="center">
  <a href="https://github.com/parasoft/destroy-environment-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Destroy an Environment

This action allows you to destroy a Parasoft Service Virtualization environment from a given Continous Testing Platform endpoint.

## Usage

Add the following to your github workflow yml file with the required inputs.
Password will use a github encrypted secret. Please reference [Encrypted Secrets Documentation](https://docs.github.com/en/actions/reference/encrypted-secrets) on how to create an encrypted secret.

```yaml
uses: parasoft/destroy-environment-action@v1
with:
  ctpUrl: 'http://exampleUrl'
  ctpUsername: 'username'
  ctpPassword: ${{ secrets.password }}
  system: 'system'
  environment: 'environment'
```

## Build and test this action locally

Install the dependencies  
```bash
$ npm install
```

Build the typescript and package it for distribution
```bash
$ npm run build && npm run package
```

Run the tests
```bash
$ npm test

 PASS  ./index.test.js

...
```