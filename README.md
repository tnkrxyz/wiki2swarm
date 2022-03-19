# A nodejs package to mirror wikimedia snapshot to Swarm

## Features
- Support asynchronous job queue with [`bee-queue`](https://github.com/bee-queue/bee-queue)
- Utilize [`swarm-cli`](https://github.com/ethersphere/swarm-cli) for interactions with bee node
- Flexibility to use command line arguments, environment variables, or interacting with swarm-cli to specify stamp, identity, and password

## Prerequisites
- [docker](https://docs.docker.com/engine/install/) 
- [docker compose](https://docs.docker.com/compose/install/)
- A running Bee node (or set one up inside a docker container following [these steps](https://github.com/tnkrxyz/wiki2swarm/beenode) )

## Quick Start (using the public Swarm testing gateway)
1. Clone this repo: `git clone https://github.com/tnkrxyz/wiki2swarm.git` and change path to the the wiki2swarm dirctory in your terminal
2. Build the docker image with command `docker compose build app`
3. Run docker containers with `docker compose up -d`
4. Check the status of your Bee node with swarm-cli; it should say "[OK] Bee API Connection"
    ```
    docker compose exec app swarm-cli status --bee-api-url https://gateway-proxy-bee-0-0.gateway.ethswarm.org
    ```
5. Use wiki2swarm to mirror a wikimedia snapshot
    ```
    docker compose exec app wiki2swarm https://download.kiwix.org/zim/wikipedia/wikipedia_en_ray_charles_mini_2022-02.zim --bee-api-url  https://gateway-proxy-bee-0-0.gateway.ethswarm.org/
    ```

    - When finished uploading successfully, it will print the Swarm hash and URL. You can visit the wikipedia snapshot by visiting the URL to your browser.

## wiki2swarm options

```
> docker compose exec app wiki2swarm --help
Usage: wiki2swarm [options] <url...>

Mirror Wikipedia snapshot in zim format to Swarm

Arguments:
  url                        zim url(s) to be mirrored to Swarm

Options:
  -d, --datadir              directory to store zim and temporary files"
  -f, --feed                 Use Swarm "feed upload" instead of "upload" (default: false)
  -k, --keep-aux-files       keep auxillary files (jpg, media, tag, and search index) (default: false)
  -c, --cleanup              Clean up downloaded and extracted files after uploading (default: true)
  -v, --verbose              Print all console messages (default: false)
  --bee-api-url <url>        Bee API URL (arugment passing to swarm-cli)
  --bee-debug-api-url <url>  Bee Debug API URL (arugment passing to swarm-cli)
  --stamp <stamp>            id of stamp postage to use (arugment passing to swarm-cli)
  --identity <identity>      identity to use for "feed upload" (arugment passing to swarm-cli)
  --password <password>      password for using identity for "fee upload" (arugment passing to swarm-cli)
  -h, --help                 display help for command
```

### "feed upload" vs "upload"
Swarm allows users to use feeds to upload/update files, so the Swarm hash (and thus URL) remains the same as files are updated, for which wikipedia snapshot is a good use case. `wiki2swarm` supports feed uploading of wikipedia snapshots. Using feeds requires creation & usage of an identity and password; swarm-cli also requires access to valid bee-debug-api and stamp. These information can be passed through command line arguments, environment variables (using a .env file or setting them in docker-compose.yml), selecting them interactively when prompted.

To create an identity, use the command `docker compose exec app swarm-cli identity create`


## References
- [Sarm Document](https://docs.ethswarm.org/docs/)
- [swarm-cli](https://github.com/ethersphere/swarm-cli)
- [Bee node](https://github.com/ethersphere/bee)



and if you have enough stamp postage for file uploading
    - If your Bee node is not on localhost or using the default ports (1633 and 1635) pass this  argument: `--bee-api-url http://ip-of-your-bee-node:port1`. For example, to use the Swarm public testing gateway, `--bee-api-url https://gateway-proxy-bee-0-0.gateway.ethswarm.org` 