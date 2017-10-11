var Crawler = require("crawler");
var htmlToText = require('html-to-text');
var fs = require('fs');

var saveFolder = 'wmw'
var urlBase = process.argv[2]
var chapRange = process.argv[3].split('-')
var downloadList = []

var c = new Crawler({
    maxConnections : 10,
    rateLimit: 1000,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            var chapName = res.request.uri.pathname.split('/')[2].split('-')[2];

            var raw = htmlToText.fromString( $("div[itemprop]").html() , {
                wordwrap: 130
            });
            // console.log(text)
            var cleanedText = raw.split('----------------------------------------------------------------------------------------------------------------------------------')[1]

            fs.writeFile('data/'+saveFolder+"/"+chapName+".txt", cleanedText , function(err){
              if(err) { return console.log(err); }
              console.log("The file was saved!");
            })
        }
        done();
    }
});




for(i=chapRange[0]; i <= chapRange[1]; i++){
  var url = urlBase + '-' + i
  downloadList.push(url)
}

console.log(downloadList)

c.queue(downloadList);
