var request = require("request");

var options = {
  method: 'PUT',
  url: 'http://renovate.thechennaisilks.com/rest/V1/guest-carts/giftcard',
  headers:
   { 'content-type': 'application/json' },
      body: { code: 'VIKI-NAME-1997',
          price: '500'
        },
      json: true
  };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body[0]);
});
