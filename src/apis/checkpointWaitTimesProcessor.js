var _ = require('lodash');

/**
 * @typedef {Object} entry
 * @property {number} start
 * @property {number} end
 * @property {number} waitTimeNormalized
 */

/**
 * @typedef {Object} checkpoint
 * @property {string} checkpointNice
 * @property {string} checkPoint
 * @property {Object} airportInfo
 */

/**
 * @typedef {Object} checkpoints
 * @property {Object} checkpoint
 * @property {entry[]} entries
 */

/**
 * @typedef {Object} airportInfo
 * @property {string} code
 * @property {string} name
 * @property {string} city
 */

/**
 * @typedef {Object} CheckPointWaitTimeResponse
 * @property {number} searchedTime - time the query was made for the wait times
 * @property {Checkpoints[]} checkpoints - the checkpoints involved in the query
 * @property {Object} airportInfo - the airport the checkpoints are at
 */


/**
 * This processes results given from the What'sBusy API for checkpoint wait time
 * at airports
 *
 *
 * @param {CheckPointWaitTimeResponse[]} waitTimeResponse - wait time response from What'sBusy
 * @returns {number} the wait time indicated by the response
 */
function getCheckpointWaitTime(waitTimeResponses) {

    if (waitTimeResponses == null || waitTimeResponses[0] == undefined || waitTimeResponses[1] == undefined) {
        console.log("RETURNING 30 MINUTES FOR WAIT TIMES BECAUSE RESPONSE WAS NULL");
        return 30;
    }
    console.log(waitTimeResponses);
    console.log(waitTimeResponses[0]);
    console.log(waitTimeResponses[1]);
    /** @type {number[]} */
    var checkpointWaitTimesArray = [];
    waitTimeResponses[0].checkpoints.forEach(checkpointInCheckpoints => {
        checkpointInCheckpoints.entries.forEach(entry => {
            checkpointWaitTimesArray.push(entry.waitTimeNormalized);  
        });
    });
    waitTimeResponses[1].checkpoints.forEach(checkpointInCheckpoints => {
        checkpointInCheckpoints.entries.forEach(entry => {
            checkpointWaitTimesArray.push(entry.waitTimeNormalized);  
        });
    });

    return checkpointWaitTimesArray.reduce((sum, nextEntry) => {
        return sum + (nextEntry * 10);
    }) / checkpointWaitTimesArray.length;
}

module.exports = {
    getCheckpointWaitTime: getCheckpointWaitTime
};
