# Pistols at Dawn -- gg.xyz quests

## Resources

* Dojo bot based on: [dojo.js/examples/example-node-worker](https://github.com/dojoengine/dojo.js/tree/cb208cab4d16a3066cd7320df709132385f5576a/examples/example-node-worker)
* Apibara quest bot example: [ggQuest/starknet-indexer-example](https://github.com/ggQuest/starknet-indexer-example)
* Quests API docs: [Push based endpoint](https://docs.gg.quest/docs/API-Oriented/push-based/#4-push-based-endpoint)

## Setup

Add environment variables to `.env`:

```sh
# [pistols config]
# NETWORK_ID=SEPOLIA
NETWORK_ID=MAINNET

# [gg.xyz config]
# API_URL=https://api.gg.quest
GAME_SECRET=1234
```

Run the bot..

```sh
pnpm i
pnpm run bun
```
