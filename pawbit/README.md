# Pawbit (Clarinet project)

A minimal SIP-010-style fungible token implemented in Clarity.

## Prerequisites
- Clarinet CLI (already installed)

## Project layout
- `Clarinet.toml` – Clarinet project config
- `contracts/pawbit.clar` – Pawbit FT contract

## Usage
```bash
cd pawbit
clarinet check         # compile & type-check
clarinet console       # open a REPL to interact
```

### Quick demo in console
```bash
clarinet console
# In the console:
::load contracts/pawbit.clar
::contract-call? .pawbit mint u1000 tx-sender
::contract-call? .pawbit get-balance tx-sender
```

## Notes
- Owner (deployer) can mint; any holder can transfer and burn.
- Metadata: name `Pawbit`, symbol `PAWBIT`, decimals `6`.
