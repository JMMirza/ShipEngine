//importing libraries and config file
const Airtable = require('airtable');
const config = require('../config')

//importing the shipengine module that is created in the same file
// named as "shipengine.js"
const { createLabelFromShipmentDetails } = require('./shipengine')

//creating base for accessing the airtable giving the api key of my account
// which is defined in config file.
const base = new Airtable({ apiKey: config.apiKey }).base(config.base);

// creating function that is called when someone create shipper address.
// this argument has req (request), res (response) params
// in the req we get data that is send from the user
// in the res we send data to the user
async function createShipFromData(req, res) {
    //now we are creating data in shipfrom table and defining the fields 
    //fields we are getting from req param
    // the create function takes an array which contains object of fields and a function
    base('shipfrom').create([
        {
            "fields": {
                ShipFromName: req.body.name,
                ShipFromCname: req.body.cname,
                ShipFromPhone: req.body.phoneNum,
                ShipFromAdd: req.body.address,
                ShipFromCity: req.body.city,
                ShipFromPostalCode: req.body.pcode,
                ShipFromCCode: req.body.ccode,
                ShipFromState: req.body.state,
                ShipFromIndicate: req.body.indc,
            }
        }
        //now we have function which has 2 params error and records
        // in case that our creating data failed we got something in the err params
        // and if not error than record info that has been added to the table in shown into the records params 
    ], function (err, records) {
        if (err) {
            //consoling data error 
            console.error(err);
            // returning the status for error and send error.
            return res.status(400).send({
                err: err
            })
        }
        // if not get any error than console the record id 
        console.log(records[0].id);
        // return data to the user using res params 
        return res.status(200).send({
            message: "user created",
            id: records[0].id,
            fields: records[0].fields
        })

    });
}
// this is ship data in case you need this its also working
// async function createShipToData(req, res) {
//     base('shipto').create([
//         {
//             "fields": {
//                 ShipToName: req.body.name,
//                 ShipToAdd: req.body.address,
//                 ShipToCity: req.body.city,
//                 ShipToPostalCode: req.body.pcode,
//                 ShipToState: req.body.state,
//                 ShipToIndicate: req.body.indc,
// 
//             }
//         }
//     ], function (err, records) {
//         if (err) {
//             console.error(err);
//             return res.status(400).send({
//                 err: err
//             })
//         }
// 
//         console.log(records[0].id);
//         return res.status(200).send({
//             message: "user created",
//             id: records[0].id,
//             fields: records[0].fields
//         })
// 
//     });
// }

// function to retrieve data from airtable and send to the ship engine module to make the label
async function retrieveData(req, res) {
    try {
        // using the shipfrom table we retrieve the data
        // in this we find the shipfrom data and if do not get any data we send response that no data found
        base('shipfrom').find(req.body.fromId, async function (err, record) {
            if (err) { console.error(err); return; }
            // console.log('Retrieved', record.fields);
            // making object for the user that has to recieve the parcel
            // make sure we are not storing it into the airtable
            const shipToData = {
                name: req.body.name,
                add: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pcode: req.body.pcode,
                ccode: req.body.ccode,
                indc: req.body.indc,
            }
            // console.log("shipto data: ", shipToData)
            // calling module for the label and sending the the shipFrom and shipTo data
            const label = await createLabelFromShipmentDetails(record.fields, shipToData)
            //consoling the data that we got from the shipment details
            console.log("from post method: ", label)
            // label consist of 2 things one is status and other is the label/error
            // if status is 200 that means we got our label
            // if status is 400 that means there is an error
            if(label.status==200){
                // returning the result
                return res.status(200).send(label.result)
            }
            //returning the error
            return res.status(400).send(label.error)
            
        });
    } catch (error) {
        // return the error in case any exception occur
        return res.status(500).send(error)
    }

}
//exporting the functions to use in routes.js file.
module.exports = { createShipFromData, retrieveData }