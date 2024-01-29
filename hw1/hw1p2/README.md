# Homework 1, Problem 2

### Setup

Add `hw1p2.py` file in this directory.

```bash
# remove --rm to persist container
docker run -it \
  --rm \
  --name ee547-hw1p2-test \
  -v "$(pwd)":/usr/src/app/ \
  -w /usr/src/app \
  node:20 \
  /bin/bash
```

Install dependencies

```bash
apt-get update
apt-get install -y \
  jq
```


### Testing

```bash
./driver.sh
```
