const ShipEngine = require("shipengine");
const config = require('../config')
const shipengine = new ShipEngine(config.shipengineApiKey);
async function createLabelFromShipmentDetails(shipFrom, shipTo) {
    const params = {
        shipment: {
            serviceCode: "ups_ground",
            shipTo: {
                name: shipTo.name,
                addressLine1: shipTo.add,
                cityLocality: shipTo.city,
                stateProvince: shipTo.state,
                postalCode: shipTo.pcode,
                countryCode: shipTo.ccode,
                addressResidentialIndicator: shipTo.indc,
            },
            shipFrom: {
                name: shipFrom.ShipFromName,
                companyName: shipFrom.ShipFromCname,
                phone: shipFrom.ShipFromPhone,
                addressLine1: shipFrom.ShipFromAdd,
                cityLocality: shipFrom.ShipFromCity,
                stateProvince: shipFrom.ShipFromState,
                postalCode: shipFrom.ShipFromPostalCode,
                countryCode: shipFrom.ShipFromCCode,
                addressResidentialIndicator: shipFrom.ShipFromIndicate,
            },
            packages: [
                {
                    weight: {
                        value: 20,
                        unit: "ounce",
                    },
                    dimensions: {
                        height: 6,
                        width: 12,
                        length: 24,
                        unit: "inch",
                    },
                },
            ],
        },
    };


    try {
        const result = await shipengine.createLabelFromShipmentDetails(params);

        console.log("The label that was created:");
        console.log(result);
        return {
            status: 200,
            result: result
        }
    } catch (e) {
        console.log("Error creating label: ", e.message);
        return {
            status: 400,
            error: e
        }
    }
}

module.exports = { createLabelFromShipmentDetails }
