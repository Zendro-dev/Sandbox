const axios_general = require('axios');
const globals = require('../config/globals');
const errorHelper = require('../utils/errors');
let axios = axios_general.create();
axios.defaults.timeout = globals.MAX_TIME_OUT;

const remoteZendroURL = "http://siagro01.conabio.gob.mx:3003/graphql";

module.exports = {
    const_books: function(_,context){
        let query = `
            query const_books{
                const_books{
                    book_id
                    name
                }
            }
        `
        let benignErrorReporter = new errorHelper.BenignErrorReporter(context);
        try {
            // Send an HTTP request to the remote server
            let response = await axios.post(remoteZendroURL, {
                query: query
            });
            // STATUS-CODE is 200
            // NO ERROR as such has been detected by the server (Express)
            // check if data was send
            if (response && response.data && response.data.data) {
                return response.data.data.const_books;
            } else {
                throw new Error(`Remote zendro-server (${remoteZendroURL}) did not respond with data.`);
            }
        } catch (error) {
            //handle caught errors
            errorHelper.handleCaughtErrorAndBenignErrors(error, benignErrorReporter, remoteZendroURL);
        }    

    }
}