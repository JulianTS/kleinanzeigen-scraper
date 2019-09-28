// @flow
const rp = require('request-promise');
const cheerio = require('cheerio');
const notifier = require('node-notifier');

let oldAd = null;
let newAd = null;

const options = {
  uri: 'https://www.ebay-kleinanzeigen.de/s-berlin/malm-140/k0l3331',
  transform: function (body) {
    return cheerio.load(body);
  }
};

function push (title, price, link) {
  notifier.notify(
    {
      title: 'Neue Anzeige!',
      message: title + '\n' + price,
      open: link,
      sound: true // Only Notification Center or Windows Toasters
    },
    function (err, response) {
      if (err) console.log(err);// Response is response from notification
    }
  );
}

function getFirstAd () {
  return rp(options)
    .then(function ($) {
      // Process html like you would with jQuery...
      const mainItem = $('div.aditem-main');
      const title = mainItem.find('a.ellipsis')[0].children[0].data;
      const description = mainItem.find('p').not('p.text-module-end')[0].children[0].data;
      const price = $('div.aditem-details').find('strong')[0].children[0].data;
      const link = 'https://www.ebay-kleinanzeigen.de' + mainItem.find('a.ellipsis')[0].attribs.href;

      oldAd = newAd;
      newAd = title;

      if (newAd !== oldAd) {
        console.log('\n\n\n\n\n\n\n\n\n');
        console.log(title);
        console.log(price);
        console.log(description);
        console.log(link);

        push(title, price, link);
      }
    });
}

setInterval(() => {
  getFirstAd()
    .catch(function (err) {
      console.log(err);
    });
}, 3000);
