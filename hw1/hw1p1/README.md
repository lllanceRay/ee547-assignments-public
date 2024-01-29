# Homework 1, Problem 1

### Setup

Add `hw1p1.py` file in this directory.

```bash
# remove --rm to persist container
docker run -it \
  --rm \
  --name ee547-hw1p1-test \
  -v "$(pwd)":/usr/src/app/ \
  -w /usr/src/app \
  python:3 \
  /bin/bash
```

Install dependencies

```bash
apt-get update
apt-get install -y \
  jq \
  libcap-dev
```


### Testing

```bash
./driver.sh
```
