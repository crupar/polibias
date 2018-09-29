'use strict';

/* Dependencies. */
var fs = require('fs');
var path = require('path');
var got = require('got');
var json = require('JSONStream');
var split = require('split');
var filter = require('stream-filter');
var merge = require('merge-stream');
var unique = require('unique-stream');
var map = require('map-stream');
var sort = require('sort-stream');
var normalize = require('nlcst-normalize');

/* Outside source. */
var words = got
  .stream('http://____.txt')
  .pipe(split());

/* Load. */
var localBiased = fs
  .createReadStream(path.join('script', 'biased.txt'))
  .pipe(split());


/* Generate. */
merge(words, localBiased)
  .pipe(map(function (data, callback) {
    callback(null, normalize(data).trim());
  }))
  .pipe(filter(Boolean))
  .pipe(unique())
  .pipe(sort())
  .pipe(map(function (data, callback) {
    callback(null, String(data));
  }))
  .pipe(json.stringify('[\n  ', ',\n  ', '\n]\n'))
  .pipe(fs.createWriteStream(path.join('index.json')));
