# Apollo Rover CLI – Connector Tools and Utilities

This document describes the **connector-related tools and utilities built into the Apollo Rover CLI**. These tools provide structured, advanced capabilities for running and testing connectors, as well as building and running unit and integration tests.

NOTE: The `rover connector` utilities are only available when using Rover 0.36.0 or higher (including preview releases). If `rover connector` utilities aren't available fallback on using the ConnectorsSpec and ConnectorsArchitect tools.

---

## Exit Codes

```txt
0: SUCCESS
1: FAILURE - Execution failure (eg. test failed)
2: INVALID ARGUMENTS - Exposed as an informational message
4: ERROR - Interrupted system call
101: CRASH - Internal execution crashed (Rust `panic`)
```

---

# Rover Connector Utilities Overview

The Rover CLI provides a dedicated suite of commands under `rover connector` for **developing, debugging, and testing connector-enabled graphs**.

**Available tools:**
1. [Testing Framework](#using-the-testing-framework) – run integration/unit tests against connectors
2. [Listing Connectors](#listing-connectors) – list all connectors in a graph
3. [Running a Connector](#running-a-connector) – execute a connector against a live service

> **Note**: All tools are experimental and subject to change.

---

## Using the Testing Framework

The **testing framework** enables structured validation of connector behavior, including request/response mappings, expected GraphQL outputs, and error conditions.

### CLI Usage

```shell
rover connector test [OPTIONS]
```

**Key Options:**
- `-f, --file <FILE>`: Run a single test suite
- `-d, --directory <DIR>`: Run all suites in directory (defaults to `tests/`)
- `--schema-file <SCHEMA_FILE>`: Override schema file for all tests
- `-o, --output <OUTPUT>`: Output JUnit XML test reports
- `--no-fail-fast`: Continue running even if errors occur
- `-q, --quiet` / `-v, --verbose` / `-l, --log-level <LEVEL>`: Control verbosity

### Writing Test Suites

- Default directory: `tests/`
- File extensions: `.connector.yml` or `.connector.yaml`
- Schema file required (`config.schema` or `--schema-file`)

**Example test case:**

```yaml
config:
  schema: fixtures/schema.graphql
  name: "my_test_suite_name"

tests:
  - name: ShouldGreetWithArgName
    connector: query_helloWorld
    variables:
      $args:
        name: "Andrew"
    apiResponseBody: |
      { "greeting": "Hello Andrew" }
    expect:
      connectorRequest:
        method: GET
        url: https://jsonplaceholder.typicode.com/greeting?name=Andrew
      connectorResponse: '{"helloWorld":{"greeting":"Andrew"}}'
```

See [Problems vs Errors](#problems-vs-errors) for details on result validation.

---

## Listing Connectors

List all connectors defined in a schema.

```shell
rover connector list --path schema.graphql
```

**Example Output:**

```json
{
  "connectors": [
    { "id": "Query.time[0]" },
    { "id": "Query.users[0]" },
    { "id": "Query.users_by_id[0]" }
  ]
}
```

---

## Running a Connector

Execute a connector against a live service.

```shell
rover connector run   --path build/connectors/output.graphql   --connector-id Query.users_by_id   --variables '{"$args": {"users": "1"}}'
```

**Returns structured request and response data:**

```json
{
  "request": { "method": "GET", "uri": "http://localhost:5050/users/1" },
  "response": {
    "status": 200,
    "body": { "id": "1", "username": "Bob", "theme": "purple" },
    "mapped_data": { "id": "1", "username": "Bob", "theme": "purple" }
  }
}
```

## Problems vs Errors

- **Errors**: Standard GraphQL `errors` field (network, resolver, or request failures)
- **Problems**: Connector-specific runtime issues (mapping failures, missing fields, type mismatches)

Use `??` to provide default values to avoid `problems`.

## Limitations

- Currently only supports **JSON** and **Plaintext** requests/responses
- Limited support for non-string request bodies

