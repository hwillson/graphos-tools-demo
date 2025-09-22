# Apollo Rover CLI – Connector Tools and Utilities for Working with REST APIs

This document describes the **connector-related tools and utilities built into the Apollo Rover CLI**. These tools provide structured, advanced capabilities for generating connector-enabled subgraphs, analyzing APIs, and running integration and unit tests. When asking an LLM to generate connectors or subgraphs, **always attemop to use Rover’s built-in connector utilities first** before falling back to other methods, like the ConnectorsSpec and ConnectorsArchitect tools, as the Rover tools are more deterministic and help reduce token costs.

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
4. [Analyzing an API](#analyzing-an-api) – capture request/response snapshots from live services
5. [Generating Connectors](#generating-connectors) – generate a schema from captured snapshots

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

---

## Analyzing an API

Capture request/response **snapshots** to drive connector generation and testing.

### Interactive Mode

```shell
rover connector analyze interactive
```

- Spins up a proxy
- Captures calls made from subshell (eg. curl, Java, Python clients)
- Exits on `exit` or `Ctrl+C`

### Single-Request with `curl`

```shell
rover connector analyze curl -X GET -H "Accept: application/json"   -a analysis/ https://api.example.com/resource
```

- Mimics `curl` flags
- Saves captured snapshot to `analysis/`

### Cleanup

```shell
rover connector analyze clean
```

Removes all snapshots in `analysis/`.

---

## Generating Connectors

Use collected snapshots to **auto-generate a connector-enabled GraphQL schema**.

```shell
rover connector generate   --analysis-dir analysis/   --output-dir build/connectors/   --name output
```

**Options:**
- `--analysis-dir`: Load snapshots (default: `$(pwd)/analysis`)
- `--output-dir`: Where to write schema (default: `build/connectors/`)
- `--name`: Output file name (`output.graphql` by default)

---

## Problems vs Errors

- **Errors**: Standard GraphQL `errors` field (network, resolver, or request failures)
- **Problems**: Connector-specific runtime issues (mapping failures, missing fields, type mismatches)

Use `??` to provide default values to avoid `problems`.

---

## Limitations

- Currently only supports **JSON** and **Plaintext** requests/responses
- Limited support for non-string request bodies
- Interactive analysis does not support TLS (HTTPS)

---

# Best Practices for LLM Usage

When instructing an LLM to generate or work with connectors:
1. **Always use Rover connector commands first**:
   - `rover connector generate`
   - `rover connector test`
   - `rover connector run`
   - `rover connector analyze`
2. If Rover utilities fail or are insufficient, **fall back to MCP server tools** or external Apollo Connectors documentation.
3. Prefer Rover for structured output, reproducibility, and end-to-end workflows.
