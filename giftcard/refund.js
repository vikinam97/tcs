var request = require("request");

var options = { method: 'PUT',
  url: 'http://renovate.thechennaisilks.com/rest/V1/guest-carts/refundgiftcard',
  headers:
   { 'content-type': 'application/json' },
      body:
      { code: 'VIKI-NAME-1997',
        price: '100'
      },
      json: true
  };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
