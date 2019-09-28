const rp = require('request-promise');
const cheerio = require('cheerio');
const Table = require('cli-table');
const notifier = require('node-notifier');


var oldAd = null;
var newAd = null;

const options = {
    uri: 'https://www.ebay-kleinanzeigen.de/s-berlin/malm-140/k0l3331',
    transform: function (body) {
        return cheerio.load(body);
    }
};

function push(title, price){

    notifier.notify(
        {
            title: 'Neue Anzeige!',
            message: title + "\n" + price,
            sound: true, // Only Notification Center or Windows Toasters
        },
        function(err, response) {
            console.log()// Response is response from notification
        }
    );
}

function getFirstAd() {
    return rp(options)
        .then(function ($) {
            // Process html like you would with jQuery...
            const title = $("div.aditem-main").find("a.ellipsis")[0].children[0].data;
            const description = $("div.aditem-main").find("p").not("p.text-module-end")[0].children[0].data;
            const price = $("div.aditem-details").find("strong")[0].children[0].data;
            const link = "https://www.ebay-kleinanzeigen.de" + $("div.aditem-main").find("a.ellipsis")[0].attribs.href;

            oldAd = newAd;
            newAd = title;

            if(newAd !== oldAd) {

                console.log("\n\n\n\n\n\n\n\n\n");
                console.log(title);
                console.log(price);
                console.log(description);
                console.log(link);

                push(title, price);
            }

        })

}



setInterval(()=>{
    getFirstAd()
        .catch(function (err) {
            // Crawling failed or Cheerio choked...
        });
}, 3000);

