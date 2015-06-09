'use strict';

var fs = require('fs');
var synop = require('../lib/synop');

switch (process.argv[2]) {
    case 'decode':
        synop.decode(process.argv[3], function(err, decoded) {
            console.log('Decoded: ' + decoded);
        });
        break;
    case 'query':
        var q = process.argv[3]; // AAXX0724
        var t = process.argv[4]; // T00
        var sta = process.argv[5]; // station
        fs.readFile('./data/' + q + '.T' + t, 'utf8', function(err, data) {
            if (err) {
                console.error('Error: ' + err);
                process.exit(1);
            }
            var d = data.split('\n');
            d.forEach(function(da) {
                if (sta === da.slice(0, 5)) {
                    synop.decode(da, function(err, decoded) {
                        console.log(decoded);
                    });
                }
            });
        });
        break;
    default:
        console.log('Usage: decode "[CODE]" | query [NAME] [TIME] [STA]');
}
