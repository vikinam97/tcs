//console.log("hello world");
var request = require("request");

var options = { method: 'PUT',
  url: 'http://renovate.thechennaisilks.com/rest/V1/guest-carts/addgiftcard',
  headers:
   { 'content-type': 'application/json' },
  body:
   { cardInfo:
      { code: 'VIKI-NAME-1997',
        amount: '1000.00',
        template: '',
        image: '',
        sender: '',
        recipient: '',
        message: '',
        name: 'Viki Raj',
        delivery_address: 'vikiraj@gmail.com' } },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
