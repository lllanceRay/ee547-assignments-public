'use strict';

const chai = require('chai');
const { expect } = chai;

const { FixtureBase } = require('../lib/fixture_base');
const fs = require('fs');
const path = require('path');

const { URL } = require('url');
const qs = require('querystring');

const {
  random_string
} = require('../lib/util');

const math = require('mathjs');
const { Permutation } = require('js-combinatorics');

const INTERPRETER = 'python3';
const SCRIPT_TO_TEST = `${__dirname}/../hw1p2.py`;

const WWW = {
  host:  'localhost',
  port:  '8088',
  proto: 'http'
};

const SECRET_FILE = '/tmp/secret.key';

// test defaults
const DEFAULT_SECRET_KEY = random_string(12);

// REUSABLE
let url, body, status, headers;


// PROCESS FLAGS
const PROCESS_PRINT_ON_CLOSE = process.env.PRINT_ON_CLOSE || false;


class Fixture extends FixtureBase {
  constructor() {
    super(INTERPRETER, SCRIPT_TO_TEST, {
      printOnClose: PROCESS_PRINT_ON_CLOSE
    });

    this.setWwwOpts(WWW);
  }

  random_string(length, mixCase = false) {
    return random_string(length, mixCase);
  }

  anagram_count(str) {
    const l_counts = {};
    for (const l of str) {
      if (!(l in l_counts)) {
        l_counts[l] = 0;
      }
      l_counts[l] += 1;
    }

    // convert to bignum
    for (const k in l_counts) {
      l_counts[k] = math.bignumber(l_counts[k])
    }

    return math.multinomial(Object.values(l_counts)).toFixed();
  }

  anagram_page(str, limit) {
    // algorithm, start with char sorted string
    // then take letters from end until anagram_count >= limit
    // use generator to create page to limit (or end of generator)
    // form page: sort list, and keep max(limit,len)

    // reverse sorted string
    const sortedStr = str.split('').sort().join('');

    let idx;
    for (idx = 1; idx < sortedStr.length; idx += 1) {
      if(this.anagram_count(sortedStr.slice(-idx)) >= limit) {
        break;
      }
    }
    
    // get combinations
    let it = Permutation.of(sortedStr.slice(-idx));
    // console.error(sortedStr.slice(0, -idx), sortedStr.slice(-idx));

    let anagramSet = new Set();
    for (const c of it) {
      anagramSet.add(sortedStr.slice(0, -idx) + c.join(''));

      if (anagramSet.size >= limit) {
        break;
      }
    }

    return Array.from(anagramSet).sort();
  }

  secret_write(secret) {
    fs.writeFileSync(SECRET_FILE, secret);
  }

  secret_rem() {
    if (fs.existsSync(SECRET_FILE)) {
      fs.unlinkSync(SECRET_FILE);
    }
  }
}


module.exports = {
  Fixture
}
