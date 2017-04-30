var googleTrends = require('google-trends-api'),
    express = require('express'),
    app = express();

app.get('/', function (req, res) {
    res.send('<h1>FireFighter API</h1>');
});

app.get('/getGoogleTrend', function (req, res) {
    var keyword = req.query.keyword;

    googleTrends.interestOverTime({keyword: keyword})
        .then(function(results){
            console.log('These results are awesome', results);
            res.send(results);
        })
        .catch(function(err){
            console.error('Oh no there was an error', err);
            res.send(err);
        });
});



app.get('/getDataByRegion', function (req, res) {
    var keyword = req.query.keyword;
    var startTime = req.query.startTime;
    var endTime = req.query.endTime;
    var geo = req.query.geo;
    var gprop = req.query.gprop;


    googleTrends.interestByRegion({keyword: keyword, startTime: new Date(startTime), endTime: new Date(endTime), geo: geo, gprop: gprop})
        .then(function(results) {
            console.log('These results are awesome', results);
            var obj = JSON.parse(res);
            var mapResponse=obj.default.geoMapData;
            for(var i=0; i<mapResponse.length; i++) {
                googleTrends.interestByRegion({keyword: keyword, geo:mapResponse[i].geoCode})
                    .then(function(results2) {
                        console.log('These results2 are awesome', results2);
                        res.send(results2);
                    })
                    .catch(function(err) {
                        console.error('Oh no there was an error', err);
                        res.send(err);
                    });

            }
            res.send(results);
        })
        .catch(function(err) {
            console.error('Oh no there was an error', err);
            res.send(err);
        });
    // getInterest('fire','2016-01-04','2017-04-28','BO','news');
});

app.listen(3000, function(){
    console.log('Listening on 3000');
});