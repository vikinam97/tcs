//console.log("hello world");
var request = require("request");

var options = { method: 'PUT',
  url: 'http://renovate.thechennaisilks.com/rest/V1/guest-carts/addgiftcard',
  headers:
   { 'content-type': 'application/json' },
  body:
   { cardInfo:
      { code: 'BTZS-OUVN-TEST',
        amount: '100.00',
        template: '',
        image: '',
        sender: '',
        recipient: '',
        message: '',
        name: 'Murali Manohar',
        delivery_address: 'murali.m@gmail.com' } },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
