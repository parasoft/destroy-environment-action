<p align="center">
  <a href="https://github.com/parasoft/destroy-environment-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Destroy an Environment

This action allows you to destroy a Parasoft service virtualization environment in a given Continous Testing Platform endpoint.

## Usage

Add the following entry to your Github workflow YAML file with the required inputs: 

```yaml
uses: parasoft/destroy-environment-action@v1
with:
  ctpUrl: 'http://exampleUrl'
  ctpUsername: 'username'
  ctpPassword: ${{ secrets.password }}
  system: 'system'
  environment: 'environment'
```
### Required Inputs
The following inputs are required to use this action:

| Input | Description |
| --- | --- |
| `ctpURL` | Specifies the Continuous Testing Platform endpoint where the environment you want to destroy is deployed. |
| `ctpUsername` | Specifies a user name for accessing the Continuous Testing Platform endpoint. |
| `ctpPassword` | Specifies a Github encrypted secret for accessing the Continuous Testing Platform endpoint. Refer to the [Encrypted Secrets Documentation](https://docs.github.com/en/actions/reference/encrypted-secrets) for details on how to create an encrypted secret. |
| `system` | Specifies the name of the system in Continous Testing Platform that contains the environment you want to destroy. |
| `environment` | Specifies the name of the environment that you want to destroy. If you deployed a replicated environment, this value should match the value specified with `newEnvironmentName` in the [deploy-environment-action](https://github.com/parasoft/deploy-environment-action). |

## Build and Test this Action Locally

1. Install the dependencies: 

```bash
$ npm install
```

2. Build the typescript and package it for distribution: 

```bash
$ npm run build && npm run package
```

3. Run the tests:

```bash
$ npm test

 PASS  ./index.test.js

...
```
