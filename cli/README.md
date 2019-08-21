# Refactor Toolbelt (RTB)

Command line interface for Refactor Services.

## Usage

This cli allows you to:

- create a user

### Options

```sh
Refactor Toolbelt

Options:
  -V, --version           output the version number
  -c, --create <entity>   create an entity such as a user, habit, or task
  -l, --list <entity>     list entities such as users, habits, or tasks
  -h, --help              output usage information
```

### Examples

List existing users

`rtb -l users`

Create a user

`rtb -c user`

### Install

Then build and install globally with yarn:

```sh
yarn
yarn global add file:$(pwd)
```

Everything should now be installed. Check your cli options:

```sh
rtb --help
```

... or jump straight in:

```sh
rtb -l users
```

### Update

Pull the latest changes, build, remove rtb and reinstall:

```sh
git pull
yarn
yarn global remove refactor-toolbelt
yarn global add file:$(pwd)
```

### Uninstall

Remove rtb:

```sh
yarn global remove refactor-toolbelt
```

## Development

### Prerequisites

In addition to `node` and `yarn`, you need `ts-node` in order to run the application directly.

```sh
yarn global add ts-node
```

### Run Locally

Install the packages and run the app with `ts-node`:

```sh
yarn
ts-node index.ts  --help
```
