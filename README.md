# A nodejs package to mirror wikimedia snapshot to Swarm

## Prerequisites
- docker 
- docker compose
- A Bee node (already running or set up one inside a docker container following step 3 below)

## Instructions
1. Clone this repo: `git clone https://github.com/tnkrxyz/wiki2swarm.git` and change path to the the wiki2swarm dirctory in your terminal
2. Build the docker image with command `docker compose build wiki2swarm`
3. Run a local Bee node with Bee Clef inside a container (Skip this step if you have a bee node running already)
    a. Required minimal configuratoin in env_minimal, edit & rename it to `.env`
        - Required minimal setup ():
            - edit .env with
                - Enable DEBUG_API
        - More details & explanation: https://docs.ethswarm.org/docs/installation/docker#docker-compose
    b. `docker compose up -d`
    c. Find the ethereum address of your node's wallet. 
        - `docker compose logs` and the address after "using ethereum address" is the wallet address. This address is persistent with the clef-1 volume between re-creation of the docker containers.
    d. Fund your node, see [Fund Your Node section of the Swarm doc](https://docs.ethswarm.org/docs/installation/fund-your-node)
4. Test your Bee node with swarm-cli and check if you have enough stamp postage for data uploading
    - If your Bee node is not on localhost or using the default ports (1633 and 1635) pass these two arguments:
        - `--BEE-API-URL http://ip-of-your-bee-node:port1 --BEE-DEBUG-API-URL http://ip-of-your-bee-node:port2`
    - `docker compose run swarm-cli status`
    - `docker compose run swarm-cli stamp list`
    - buy more stamps if necessary `swarm-cli stamp buy --depth 17 --amount 1000`
    
5. Use wiki2swarm to mirror wikimedia snapshots
    - `docker compose run wiki2swarm upload <url>`
    - `docker compose run wiki2swarm feed <url>`
        - the Swarm hash remains the same for the same file
        - requires creation of an identity & using a password
    - By default, both commands require selection of stamp during runtime. If you want to bypass this interactive confirmation, pass a `--stamp <stamp id>` argument

## Test your setup with the goerli testnet
- Rename `env_goerli` to `.env` and add these settings
    - infura/getblock
- Start the Bee node
    - `docker compose up -d`
- Find the ethereum address of your node and fund your node
    - Find the ethereum address
    - Get a cheque from the Swarm discord faucet
    - Withdraw cheque into gBZZ/gETH: `cheque withdraw 2500000000000000`
    - buy stamp `stamp buy --depth 17 --amount 1000`
    - check stamp `stamp list` & `stamp show`
- upload zim files
    - `wiki2swarm upload <zim url> --stamp <stamp id>`

## Use System environment and swarm-cli config
To avoid passing the same command line arguments over & over, it is easier to either system environment (by adding them to the .env file) or use the swarm-cli config file

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