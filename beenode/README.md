# docker compose for running a Bee node container

Adapted from docker compose of the [bee repository](https://github.com/ethersphere/bee/tree/master/packaging/docker)

## Set up a local Bee node and test your setup with the goerli testnet
- Run a local Bee node inside a container
    a. In your terminal, change path to `wiki2swarm/beenode/`
    a. Create an `.env` file and fill in environment variable
        - Details & explanation of environment variables: https://docs.ethswarm.org/docs/installation/docker#docker-compose
    b. Start the Bee node with `docker compose up -d`
    c. Find the ethereum address of your node's wallet:
        - `docker compose logs` and the address after "using ethereum address" is the wallet address. This address is persistent with the clef-1 volume between re-creation of the docker containers.
    d. Fund your node, see [Fund Your Node section of the Swarm doc](https://docs.ethswarm.org/docs/installation/fund-your-node)

- Set up local bee node on the goerli testnet
    1. Rename `env_goerli` to `.env`
    2. Apply an account from one of the Ethereum RPC providers, create an API key, and set the BEE_SWAP_ENDPOINT with the RPC URL with the API key:
        - infura
        - getblock
    2. Start the Bee node with
        ```
        cd beenode
        docker compose up -d
        ```
    3. Find the ethereum address of your node and fund your node
        - Find the ethereum address from the output of `docker compose logs`
        - Get a cheque from the Swarm discord faucet: https://discord.gg/wdghaQsGq5
    4. Change path to the `wiki2swarm` directory Start a wiki2swarm container 
        ```
        cd ..
        docker compose up -d
        ```
    5. You can interact with your local bee node on the goerli testnet with the `swarm-cli`
        - buy stamp `docker compose exec app swarm-cli stamp buy --depth 17 --amount 1000`
            - check stamp `stamp list` & `stamp show`
        - upload zim files
            - `wiki2swarm upload <zim url> --stamp <stamp id>`

## Use System environment and swarm-cli config
To avoid passing the same command line arguments over and over, it is easier to use either system environment (by adding them to the .env file) or the swarm-cli config file

- System Environment: These are the system environment that can be set in `.env`
    - BEE_API_URL=http://ip-of-the-node:1633
    - BEE_DEBUG_API_URL=http://ip-of-the-node:1635
    - BEE_POSTAGE_STAMP_ADDRESS=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
    - SWARM_CLI_CONFIG_FOLDER
    - SWARM_CLI_CONFIG_FILE
- swarm-cli config file (default `~/.swarm-cli/config.json`)
    ```
    {
      "beeApiUrl": "http://ip-of-the-node:1633",
      "beeDebugApiUrl": "http://ip-of-the-node:1635",
      "stamp": 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
    }
    ```

## References
- [Sarm Document](https://docs.ethswarm.org/docs/)
- [swarm-cli](https://github.com/ethersphere/swarm-cli)
- [Bee node](https://github.com/ethersphere/bee)