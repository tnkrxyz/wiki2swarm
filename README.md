# A nodejs package to mirror wikimedia snapshot to Swarm

## Features
- Support asynchronous job queue with [`bee-queue`]()
- Utilize [`swarm-cli`](https://github.com/ethersphere/swarm-cli) for interactions with bee node
- Use command line arguments or directly interact with swarm-cli to select stamp, identity, and password

## Prerequisites
- docker 
- docker compose
- A running Bee node (or set one up inside a docker container following step 3 below)

## Quick Start (using the public Swarm testing gateway)
1. Clone this repo: `git clone https://github.com/tnkrxyz/wiki2swarm.git` and change path to the the wiki2swarm dirctory in your terminal
2. Build the docker image with command `docker compose build app`
3. (optional) Run a local Bee node with Bee Clef inside a container (Skip this step if you have a running bee node  already or use one of the swarm testing gateways)
4. Check the status of your Bee node with swarm-cli and if you have enough stamp postage for file uploading
    - If your Bee node is not on localhost or using the default ports (1633 and 1635) pass this  argument: `--bee-api-url http://ip-of-your-bee-node:port1`. For example, to use the Swarm public testing gateway, `--bee-api-url https://gateway-proxy-bee-0-0.gateway.ethswarm.org` 
    ```
    docker compose exec app swarm-cli status
    docker compose exec app swarm-cli stamp list
    docker compose exec app swarm-cli stamp buy --depth 20 --amount 100000
    ```

5. Use wiki2swarm to mirror wikimedia snapshots
    - `docker compose exec app wiki2swarm upload <url>`
    - `docker compose exec app wiki2swarm upload --feed <url>`
        - the Swarm hash remains the same for the same file
        - requires creation of an identity & using a password
    - By default, both commands require selection of stamp during runtime. If you want to bypass this interactive confirmation, pass a `--stamp <stamp id>` argument
    - Additional arguments or use a config.json file
        - stamp
        - bee-api-url
        - bee-debug-api-url
        - identity (for feed only)
        - password (for feed only)
        - pin

## Set up a local Bee node and test your setup with the goerli testnet
- Run a local Bee node inside a container
    a. In your terminal, change path to `beenode/`
    a. Required minimal configuratoin in env_minimal, rename it to `.env` and fill in below
        - Required minimal setup ():
            - edit .env with
        - 
        - More details & explanation: https://docs.ethswarm.org/docs/installation/docker#docker-compose
    b. Start the Bee node with `docker compose up -d`
    c. Find the ethereum address of your node's wallet. 
        - `docker compose logs` and the address after "using ethereum address" is the wallet address. This address is persistent with the clef-1 volume between re-creation of the docker containers.
    d. Fund your node, see [Fund Your Node section of the Swarm doc](https://docs.ethswarm.org/docs/installation/fund-your-node)

- Set up local bee node on the goerli testnet
    1. Rename `env_goerli` to `.env` and add these settings
        - infura/getblock
    2. Start the Bee node with 
        ```
        cd beenode
        docker compose up -d
        ```
    3. Find the ethereum address of your node and fund your node
        - Find the ethereum address from the output of `docker compose logs`
        - Get a cheque from the Swarm discord faucet
    4. Change path to the `wiki2swarm` directory Start a wiki2swarm container 
        ```
        cd ..
        docker compose up -d
        ```
    5. 
    - buy stamp `stamp buy --depth 17 --amount 1000`
        - check stamp `stamp list` & `stamp show`
    - upload zim files
        - `wiki2swarm upload <zim url> --stamp <stamp id>`

## Use System environment and swarm-cli config
To avoid passing the same command line arguments over and over, it is easier to either system environment (by adding them to the .env file) or use the swarm-cli config file

- System Environment These are the system environment that can be added to `.env`
    - BEE_API_URL=http://ip-of-the-node:1633
    - BEE_DEBUG_API_URL=http://ip-of-the-node:1635
    - BEE_POSTAGE_STAMP_ADDRESS=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

- swarm-cli config file (`wikiswarm/config.json`)
    ```
    {
      "beeApiUrl": "http://ip-of-the-node:1633",
      "beeDebugApiUrl": "http://ip-of-the-node:1635",
      "stamp": 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
    }
    ```

SWARM_CLI_CONFIG_FOLDER = WORKDIR
SWARM_CLI_CONFIG_FILE config.son

## References
- Bee node code & document
- swarm-cli