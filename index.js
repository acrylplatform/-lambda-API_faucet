const axios = require('axios');
const acryl = require('@acryl/acryl-transactions');

exports.handler = async (event, context, callback) => {

    const dataReq = JSON.parse(event.body);
    
    if (dataReq.address === undefined || dataReq.token === undefined) {
        callback(null, { "statusCode" : 200, "body" :"400 Invalid Input"});
    }
    
    const address = dataReq.address;
    const response  = dataReq.token;
    const secret_key = process.env.secret_key;

    await axios.post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
          },
        },
    )
    .then(function (response) {
        console.log(response.data);
        if(response.data.success === true){
            const MASTER_SEED = process.env.MASTER_SEED;
            const API_BASE = 'https://nodestestnet.acrylplatform.com'; 
          
            try {
                const ttx = acryl.transfer({ recipient: address, amount: 1000000000, feeAssetId: null }, MASTER_SEED);
                acryl.broadcast(ttx, API_BASE);
                callback(null, { "statusCode" : 200, "body" : "Success"});
            } catch (err) {
                callback(null, { "statusCode" : 200, "body" : "Invalid addres"});
            }
        }else{
            callback(null, { "statusCode" : 200, "body" : "Captcha error!"});
        }
    })
    .catch(function (error) {
        console.log(error);
    })
};