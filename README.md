# Secure Document Notarization System

A blockchain-based document notarization system built with Clarity smart contracts for the Stacks ecosystem. This system provides secure, tamper-proof document registration, notarization, and verification.

## Features

- **Document Registration**: Register documents with secure cryptographic hashes
- **Notary Verification**: Validate the credentials of authorized notaries
- **Timestamp Certification**: Record when documents were notarized with blockchain timestamps
- **Access Management**: Control who can view or verify documents

## Smart Contracts

### Document Hashing Contract

The document hashing contract creates unique digital fingerprints of documents and stores them on the blockchain.

Key functions:
- `register-document`: Register a new document with its hash
- `verify-document`: Verify a document against its stored hash
- `get-document`: Retrieve document information

### Notary Verification Contract

This contract validates the credentials of authorized notaries in the system.

Key functions:
- `register-notary`: Register a new authorized notary
- `deactivate-notary`: Deactivate a notary's credentials
- `is-notary`: Check if a principal is an active notary

### Timestamp Certification Contract

Records when documents were notarized with secure blockchain timestamps.

Key functions:
- `certify-document`: Certify a document with a notary's signature
- `verify-certification`: Verify a document's certification
- `get-certification`: Get certification details for a document

### Access Management Contract

Controls who can view or verify documents in the system.

Key functions:
- `grant-access`: Grant access to a document for a specific principal
- `revoke-access`: Revoke previously granted access
- `has-access`: Check if a principal has access to a document

## Development

### Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet) - Clarity development environment
- [Node.js](https://nodejs.org/) - For running tests

