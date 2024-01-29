# Homework 1, Problem 3

### Setup

Add `hw1p3.csv` file in this directory.

```bash
# remove --rm to persist container
docker run -it \
  --rm \
  --name ee547-hw1p2-test \
  -v "$(pwd)":/usr/src/app/ \
  -w /usr/src/app \
  python:3 \
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
