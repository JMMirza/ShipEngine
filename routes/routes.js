//importing the libraries
const express = require('express');
// calling router file
const router = express.Router();
//importing functions that we have created in the controller/postmethods file.
const {  retrieveData, createShipFromData } = require('../controller/postMethods');

// defining the routes for the API to hit thr url and when we got request from "/api/createShipFrom" we call the createShipFromData
// now you see that we have use api/ so this is defined in the server file to use api from every url
router.post('/createShipFrom', createShipFromData)
// router.post('/createShipTo', createShipToData)
router.post('/getShipInfo', retrieveData)
//exporting the router so that we can use in the server.js file
module.exports = router;