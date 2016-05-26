var chalk = require('chalk'),
    fs = require('fs'),
    table = require('text-table');


var getPositionFromArray = function(position, array) {
    return array[position] ? array[position] : 0
}

var translatePosition = function(position) {

    if (position === 'DE' || position === 'DT') {
        return 'DL';
    }
    else if (position === 'CB' || position === 'S') {
        return 'DB';
    }

    else return position;
}

var showResultsFromExport = function(filename, description, positionsToUse) {

    console.log('\n\n%s', description);

    var scores = JSON.parse(fs.readFileSync(filename, { 'encoding' : 'utf-8' })).results;

    var positionCountMap = [];

    var tiers = [ 24, 48, 72, 120, 168 ];
    var completedTiers = [ ];

    var requestedPositionsCounter = 0;

    var iopResults = [];

    for ( var i = 0; i < scores.length; i++) {

        var position = translatePosition(scores[i]['player_link/_text'].slice(-2).trim());


        if (!positionCountMap[position]) {
            positionCountMap[position] = 0;
        }

        positionCountMap[position] = positionCountMap[position] + 1;

        if (positionsToUse.indexOf(position) > -1) {
            requestedPositionsCounter++;
        }

        if (tiers.indexOf(requestedPositionsCounter) > -1 && completedTiers.indexOf(requestedPositionsCounter) === -1) {

            var rowToInsert = [];

            rowToInsert.push('Top ' + requestedPositionsCounter);
            for (var j = 0; j < positionsToUse.length; j++) {
                rowToInsert.push(getPositionFromArray(positionsToUse[j], positionCountMap))
            }
            iopResults.push(rowToInsert);

            /*
            iopResults.push([
                                'Top ' + requestedPositionsCounter,
                                getPositionFromArray('QB', positionCountMap),
                                getPositionFromArray('RB', positionCountMap),
                                getPositionFromArray('WR', positionCountMap),
                                getPositionFromArray('TE', positionCountMap)
                            ]);
            */

            completedTiers.push(requestedPositionsCounter);
        }

    }

    var headerRow = [];
    headerRow.push('');
    for (var j = 0; j < positionsToUse.length; j++) {
        headerRow.push(positionsToUse[j]);
    }
    iopResults.unshift(headerRow);

    console.log(table(iopResults));
}


var iopPositions = ['QB', 'RB', 'WR', 'TE', 'PK'];
var idpPositions = ['DE', 'DT', 'LB', 'CB', 'S'];
var allPositions = ['QB', 'RB', 'WR', 'TE', 'DL', 'LB', 'DB'];

showResultsFromExport('Z51-baseline.json', 'Baseline ( current PPR )', allPositions);
//showResultsFromExport('mason-superflex-a.json', 'Mason SuperFlex A', allPositions);
//showResultsFromExport('mason-superflex-b.json', 'Mason SuperFlex B', allPositions);
showResultsFromExport('TE-1.5PP1Dn.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; Others .5pt 1Dn - http://www65.myfantasyleague.com/2016/home/51340', allPositions);
//showResultsFromExport('TE-1.5PP1Dn__.12RuYd.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; Others .5pt 1Dn; .12pts RuYd - http://www65.myfantasyleague.com/2016/home/76467', allPositions);
showResultsFromExport('TE-1.5PP1Dn - DB-.875Tackle.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; Others .5pt 1Dn; DB 3/4points - http://www65.myfantasyleague.com/2016/home/64009', allPositions);
//showResultsFromExport('test-3.json', 'QB 4pts Passing TD; TE 1pt 1Dn; Others .5pt 1Dn - DB uses LB scoring', allPositions);
//showResultsFromExport('test-4.json', 'QB 4pts Passing TD; TE 1pt 1Dn; RB .75pt 1Dn; Others .5pt 1Dn - DB uses LB scoring', allPositions);
//showResultsFromExport('test-5.json', 'QB 4pts Passing TD; TE 1pt 1Dn; RB .75pt 1Dn && 1.2 Pts/RuYd; Others .5pt 1Dn - DB uses LB scoring', allPositions);
//showResultsFromExport('test-6.json', 'QB 4pts Passing TD; TE 1pt 1Dn; Others .5pt 1Dn; RB 1.2 Pts/RuYd;  - DB uses LB scoring', allPositions);
//showResultsFromExport('test-7.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; RB .75pt 1Dn; Others .5pt 1Dn; .12pts RuYd - http://www65.myfantasyleague.com/2016/home/67040', allPositions);
