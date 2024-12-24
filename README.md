# go-music

Sonify your Go games!

## Some dev stuff

Add yarn dependencies:

```shell
docker compose run --rm static yarn add ...
```

Install yarn packages:

```shell
docker compose run --rm static yarn install
```

Build static:

```shell
docker compose run --rm static yarn build
```

Run dev server:

```shell
docker compose up
```

Then point your browser at: `http://http://localhost:1234/`