/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
const express = require('express');
const axios = require('axios');

const wordroute = express.Router();

/**
 * Calculate Top N words from requested text
 * The Text is fetched from a site
 * @param {Number} topn - top N most frequent words
 * @returns {Array} - Array of objects, containing top n words and its count
 */
getTopNwords = async (topn) => {
  const mapwordcount = {};
  const finaltopcount = [];

  const response = await axios.get('https://raw.githubusercontent.com/invictustech/test/main/README.md');
  const text = response.data;

  text.match(/[A-za-z0-9_']+/g).map((word) => {
    const lowerword = word.toLowerCase();
    mapwordcount[lowerword] = (mapwordcount[lowerword]) ? mapwordcount[lowerword] + 1 : 1;
  });

  topkeys = Object.keys(mapwordcount)
    .sort((a, b) => mapwordcount[a] - mapwordcount[b])
    .reverse()
    .slice(0, topn)
    .map((word) => {
      finaltopcount.push({ word, count: mapwordcount[word] });
    });

  return finaltopcount;
};

wordroute.post('/wordfreq/:topn', async (req, res) => {
  try {
    if (req.params.topn) {
      // Get top n number from params
      logger.info(`Routes/Words: Params: Get top most ${req.params.topn} frequent words`);
      const finaldata = await getTopNwords(req.params.topn);
      res.status(200).send({ message: 'success', data: finaldata });
    } else if (Object.keys(req.body).length > 0) {
      // Get top n number from body
      logger.info(`Routes/Words: Body: Get top most ${req.body.topn} frequent words`);
      const finaldata = getTopNwords(req.body.topn);
      res.status(200).send({ message: 'success', data: finaldata });
    } else {
      logger.warn('Routes/Words: topn variable not found in params or body');
      res.status(401).send({ message: 'topn variable not found in params or body' });
    }
  } catch (error) {
    logger.error(`Routes/Words: Error while finding top frequent words: ${((error.stack) ? error.stack : error)}`);
    res.status(401).send({ message: `Error while finding top frequent words: ${error}` });
  }
});

module.exports = wordroute;
