const search = require('express').Router();
const store = require('routes/search/store');


search.get('/:name', (request, response) => {
    const name = request.params.name;
    console.log(`Started search for ${name}`);
    store.search({ name }).then((data) => {
        console.log(`Succesfully received data: ${data}`);
        response.status(200).json({ 'list': data });
    });
});

module.exports = search;