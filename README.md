# gw2bot-site

The website of [GW2Bot](https://github.com/Maselkov/GW2Bot), created by [Maselkov](https://github.com/Maselkov/).
Visit [gw2bot.info](https://gw2bot.info/) to see the live website.

## About

This website is built using [Nuxt.js](https://v2.nuxt.com/) and takes advantage of an embedded [Express.js](https://expressjs.com/) API.

It showcases some features of the bot, lists the available commands, and hosts a couple of FAQs.

It also has Discord authentication for viewing encounter logs that are uploaded via the bot.

## Setup

``` bash
# Install dependencies
npm install

# Run locally for development
npm run dev

# Build for production
npm run build
# Start production server
npm run start
```

### Docker

``` bash
# Build and run the production server on port 3000
docker compose up -d --build

# Or run the prebuilt image instead of building locally
docker compose pull && docker compose up -d
```

GitHub Actions lints and builds every pull request. Pushes to `master` also publish the image to `ghcr.io/maselkov/gw2bot-site` as `latest` and as the full commit SHA. Set `TAG` to run a specific image, for example `TAG=v1.1.2`.

### Deployment

Pushing a `v*` tag on a `master` commit deploys that commit to production, after approval on the `prod` GitHub environment. The site runs as a `site` service in the same compose project as GW2Bot on the server, and deploys the same way: a self-hosted runner connects over SSH, pins the image and recreates only the site's container. The deploy fails unless the container reports healthy.

``` bash
git tag v1.2.0 && git push origin v1.2.0
```

Each deployed service pins its image in its own file: `docker-compose.site.yml` for the site and `docker-compose.bot.yml` for GW2Bot. This way the deploys never overwrite each other, and `docker-compose.override.yml` stays free for manual changes.

One-time setup on the server, in the directory that holds the compose file (`DEPLOY_DIR`):

1. Add the service to `docker-compose.yml`:

   ``` yaml
   site:
     image: ghcr.io/maselkov/gw2bot-site
     restart: unless-stopped
     depends_on:
       mongo:
         condition: service_healthy
     environment:
       MONGO_HOST: mongo
       MONGO_PORT: 27017
     ports:
       # For the reverse proxy in front of gw2bot.info
       - "127.0.0.1:3000:3000"
   ```

   If GW2Bot's `.env` sets `MONGO_DB`, set the same value here.

2. Make compose merge the pins by adding this line to `.env` in the same directory (create the file if needed). Both deploys refuse to run without it:

   ``` bash
   COMPOSE_FILE=docker-compose.yml:docker-compose.override.yml:docker-compose.bot.yml:docker-compose.site.yml
   ```

   Every listed file must exist, so run `touch docker-compose.override.yml docker-compose.bot.yml docker-compose.site.yml` before the first deploy.

On GitHub:

- Add a `prod` environment to this repository with the same `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `SSH_KNOWN_HOSTS` and `DEPLOY_DIR` secrets as GW2Bot.
- Register a self-hosted runner for this repository. Runners on a personal account belong to a single repository, so GW2Bot's runner won't pick up these jobs.

The container connects to MongoDB on the host by default (`host.docker.internal`). Set `MONGO_HOST`, `MONGO_PORT`, `MONGO_DB` or `PORT` in your shell or a `.env` file to change this. `MONGO_DB` defaults to `gw2bot`, GW2Bot's own database, and must match the bot's `MONGO_DB`. If MongoDB runs on the host, its `bindIp` must include an address that Docker can reach, such as the docker bridge IP or `0.0.0.0`, and not just `localhost`.

### Nuxt configuration

You must replace `YOUR_BOT_ID` in the file `./nuxt.config.js` with your Discord bot's Client ID for authentication.

``` js
// ./nuxt.config.js

export default {
  auth: {
    strategies: {
      discord: {
        client_id: 'YOUR_BOT_ID'
      }
    }
  }
}
```

### Discord bot configuration

You must configure the OAuth2 redirect URIs for your bot to allow Discord authentication. Go to your [Discord Developer Portal](https://discord.com/developers/applications/) and select your bot. Go to OAuth2 General settings and enter the following URIs:

Development: `http://localhost:3000/login`

Production: `https://gw2bot.info/login`

### MongoDB configuration

In development, make sure your local mongodb service is running when you try to view the logs page. The website connects to the same database used by GW2Bot.

If your connection to the database times out, you may need to edit your [mongod configuration file](https://www.mongodb.com/docs/manual/reference/configuration-options/#configuration-file-options) to enable IPV6 connection to localhost:

``` yaml
# path/to/mongod.cfg

net:
  port: 27017
  bindIp: localhost,127.0.0.1
  ipv6: true
```

#### Encounter Details

The website will set a `details` field for each database entry in the `gw2.encounters` collection of the `toothy` database when a user visits the `/logs` page to view their encounter logs. The `details` object contains extra data about each encounter and is fetched from `dps.report` on the client-side, then sent to the server via POST request. The data is validated before being saved to the database.

In the event that you need to reset the details field of every encounter in the database, use the [updateMany](https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/) method via [mongosh](https://www.mongodb.com/try/download/shell):

``` shell
# Connect to the database via mongosh
mongosh "mongodb://localhost:27017"

# Switch to the toothy database
use toothy

# Delete the "details" field of every encounter in the database
db.getCollection("gw2.encounters").updateMany({}, { $unset: { details: true }})
```

## Contribution

Feel free to create an issue or pull request for any improvement you would like to add.

For pull requests, please explain the issue, your solution/improvement, and make sure ESLint is happy.
