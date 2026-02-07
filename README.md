# Transitmix [![Build Status](https://travis-ci.org/codeforamerica/transitmix.svg?branch=master)](https://travis-ci.org/codeforamerica/transitmix)

[Transitmix](http://transitmix.net/) is a sketching tool for transit planners. The tool makes it easy to draw new transit lines, understand the underlying costs, and share ideas with the public. So far, Transitmix been used to generate 30,000 new transit maps for more than 3,600 cities across the world, all powered by open data and data standards ([OpenStreetMap](http://openstreetmap.org), [Open Source Routing Machine](http://project-osrm.org), and the [Google Transit Feed Specification](http://www.gtfs-data-exchange.com/).

The project comes from a team at [Code for America](http://codeforamerica.org), a non-profit based in San Francisco focused on building better cities through technology.

Contact us at [transitmix@codeforamerica.org](mailto:transitmix@codeforamerica.org).

### Who is this made by?

- [Sam Hashemi](https://twitter.com/oksamuel)
- [Dan Getelman](https://twitter.com/dget)
- [Tiffany Chu](https://twitter.com/tchu88)
- [Danny Whalen](https://twitter.com/invisiblefunnel)
- [Lyzi Diamond](https://twitter.com/lyzidiamond)

With additional help from [Jason Denizac](https://github.com/jden), [Becky Boone](https://github.com/boonrs), [Maksim Pecherskiy](https://github.com/mrmaksimize), and [Andrew Douglass](https://github.com/ardouglass).

### How can I help?

* Check out our GitHub Issues page [here](https://github.com/codeforamerica/transitmix/issues/).

### Setup

Transitmix is a Ruby application with a PostgreSQL database. The frontend uses Vite for development with hot module replacement (HMR).

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) (v18+)

#### Quick Start

1. Clone the repository and install dependencies:

```console
git clone https://github.com/codeforamerica/transitmix.git
cd transitmix
cp .env.sample .env
npm install
```

2. Start the development environment:

```console
# Terminal 1: Start the backend (Ruby API + PostgreSQL)
docker compose up

# Terminal 2: Start the Vite dev server (frontend with HMR)
npm run dev
```

3. Open http://localhost:3000 in your browser

The Vite dev server on port 3000 proxies API requests to the Ruby backend on port 8080.

#### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build locally |
| `docker compose up` | Start backend in development mode |
| `npm run backend:prod` | Start backend in production mode |
| `npm run test:e2e` | Run Cypress E2E tests |
| `npm run cypress:open` | Open Cypress test runner |

#### Production Build

To run the app with the production frontend build:

```console
npm run build
RACK_ENV=production docker compose up
```

Then open http://localhost:8080

### Deploying to Heroku

```console
heroku create <app name>
heroku addons:add heroku-postgresql
git push heroku master
heroku run rake db:migrate
heroku open
```

### Additional Setup Notes

#### Error Logging

Transitmix can be configured to log runtime errors to an external service like [Airbrake](https://airbrake.io/) or [Errbit](https://github.com/errbit/errbit). Set the `ERROR_LOG_KEY` and `ERROR_LOG_HOST` environment variables to enable the extension.

#### Testing References

* Javascript: [Jasmine](http://jasmine.github.io/)
* Ruby: [RSpec](https://www.relishapp.com/rspec)
