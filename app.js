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

var getPositionPercentage = function(positionArray, positionsToUse, array) {

    var reportingPositionsTotal = 0,
        total = 0;

    for (var j = 0; j < positionsToUse.length; j++) {

        var positionTotal = array[positionsToUse[j]];
        if (!isNaN(positionTotal)) {
            total += positionTotal;

            if (positionArray.indexOf(positionsToUse[j]) > -1) {
                reportingPositionsTotal += array[positionsToUse[j]];
            }
        }
    }

    return Math.round(((reportingPositionsTotal / total) * 100) * 100) / 100;
/*

    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += array[i];
    }

    var positionTotal = 0;
    for (var i = 0; i < positionArray.length; i++) {
        positionTotal += array[positionArray[i]];
    }

    console.log('Found %d / %d', positionTotal, total);
    return positionTotal / total;
    */
}

var showResultsFromExport = function(filename, description, positionsToUse) {

    console.log('\n\n%s', description);

    var scores = JSON.parse(fs.readFileSync(filename, { 'encoding' : 'utf-8' })).results;

    var positionCountMap = [];

    var tiers = [ 5, 12, 24, 48, 72, 96, 120, 168 ];
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

            rowToInsert.push(getPositionPercentage(iopPositions, positionsToUse, positionCountMap));
            rowToInsert.push(getPositionPercentage(idpPositions, positionsToUse, positionCountMap));

            iopResults.push(rowToInsert);
            completedTiers.push(requestedPositionsCounter);
        }

    }

    var headerRow = [];
    headerRow.push('');
    for (var j = 0; j < positionsToUse.length; j++) {
        headerRow.push(positionsToUse[j]);
    }
    headerRow.push('O%');
    headerRow.push('D%');
    iopResults.unshift(headerRow);

    console.log(table(iopResults));
}


var iopPositions = ['QB', 'RB', 'WR', 'TE', 'PK'];
//var idpPositions = ['DE', 'DT', 'LB', 'CB', 'S'];
var idpPositions = ['DL', 'LB', 'DB'];
var allPositions = ['QB', 'RB', 'WR', 'TE', 'DL', 'LB', 'DB'];


// Baseline leagues
//showResultsFromExport('Z1-classic-baseline.json', 'Baseline ( current non-PPR )', allPositions);
//showResultsFromExport('Z1-classic-baseline__2014.json', '2014 Baseline ( current non-PPR )', allPositions);
//showResultsFromExport('Z51-baseline.json', 'Baseline ( current PPR )', allPositions);
//showResultsFromExport('Z51-baseline__2014.json', '2014 Baseline ( current PPR )', allPositions);

// McDowell's Kitchen Sink league
//showResultsFromExport('Kitchen-Sink-Scoring.json', 'Kitchen Sink Scoring - http://www65.myfantasyleague.com/2016/home/55402', allPositions);
//showResultsFromExport('Kitchen-Sink-Scoring__2014.json', '2014 Kitchen Sink Scoring - http://www65.myfantasyleague.com/2016/home/55402', allPositions);

// TwoQBs Scoring
//showResultsFromExport('QB-4PassTD_All-0.5PPR_DB-0.875Tackle.json', 'QB 4pt Passing TD; All 0.5 PPR; DB 3/4points - http://www65.myfantasyleague.com/2016/home/58279', allPositions);
//showResultsFromExport('QB-4PassTD_All-0.5PPR_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; All 0.5 PPR; DB 3/4points - http://www65.myfantasyleague.com/2016/home/58279', allPositions);

// Leading the pack
//showResultsFromExport('QB-4PassTD_RB-0.25ppc_Others-0.75PPR_DB-0.875Tackle.json', 'QB 4pt Passing TD; RB 0.25ppc; Everyone Else 0.75 PPR; DB 3/4points - http://www65.myfantasyleague.com/2016/home/54840', allPositions);
//showResultsFromExport('QB-4PassTD_RB-0.25ppc_Others-0.75PPR_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; RB 0.25ppc; Everyone Else 0.75 PPR; DB 3/4points - http://www65.myfantasyleague.com/2016/home/54840', allPositions);

// Leading the pack, with an RB ppr bump
//showResultsFromExport('QB-4PassTD_RB-0.25ppc0.25ppr_Others-0.75PPR_DB-0.875Tackle.json', 'QB 4pt Passing TD; RB 0.25ppc & 0.25ppr; Everyone Else 0.75 ppr; DB 3/4points - http://www65.myfantasyleague.com/2016/home/60752', allPositions);
//showResultsFromExport('QB-4PassTD_RB-0.25ppc0.25ppr_Others-0.75PPR_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; RB 0.25ppc & 0.25ppr; Everyone Else 0.75 ppr; DB 3/4points - http://www65.myfantasyleague.com/2016/home/60752', allPositions);

// Leading the pack, with an RB ppr bump and TE ppr bump
//showResultsFromExport('QB-4PassTD_RB-0.25ppc0.25ppr_TE-1.25ppr_Others-0.75PPR_DB-0.875Tackle.json', 'QB 4pt Passing TD; RB 0.25ppc & 0.25ppr; TE 1.25 ppr; Everyone Else 0.75 ppr; DB 3/4points - http://www65.myfantasyleague.com/2016/home/75853', allPositions);
//showResultsFromExport('QB-4PassTD_RB-0.25ppc0.25ppr_TE-1.25ppr_Others-0.75PPR_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; RB 0.25ppc & 0.25ppr; TE 1.25 ppr; Everyone Else 0.75 ppr; DB 3/4points - http://www65.myfantasyleague.com/2016/home/75853', allPositions);

// "Leading the pack", plus normal graduated ppr
showResultsFromExport('QB-4PassTD_RB-0.25ppc0.5ppr_TE-1.5ppr_Others-1PPR_DB-0.875Tackle.json', 'QB 4pt Passing TD; RB 0.25ppc & 0.5ppr; TE 1.5 ppr; Everyone Else 1 ppr; DB 3/4points - http://www65.myfantasyleague.com/2016/home/50130', allPositions);
showResultsFromExport('QB-4PassTD_RB-0.25ppc0.5ppr_TE-1.5ppr_Others-1PPR_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; RB 0.5ppc & 0.25ppr; TE 1.5 ppr; Everyone Else 1 ppr; DB 3/4points - http://www65.myfantasyleague.com/2016/home/50130', allPositions);



/*
showResultsFromExport('QB-4PassTD_RB-0.25ppc_DB-0.875Tackle.json', 'QB 4pt Passing TD; RB 0.25ppc; DB 3/4points - http://www65.myfantasyleague.com/2016/home/66920', allPositions);
showResultsFromExport('QB-4PassTD_RB-0.25ppc_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; RB 0.25ppc; DB 3/4points - http://www65.myfantasyleague.com/2016/home/66920', allPositions);

showResultsFromExport('QB-4PassTD_RB-0.25ppc_Reduced-PPR_DB-0.875Tackle.json', 'QB 4pt Passing TD; RB 0.25ppc; Reduced PPR; DB 3/4points - http://www65.myfantasyleague.com/2016/home/51132', allPositions);
showResultsFromExport('QB-4PassTD_RB-0.25ppc_Reduced-PPR_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; RB 0.25ppc; Reduced PPR; DB 3/4points - http://www65.myfantasyleague.com/2016/home/51132', allPositions);
showResultsFromExport('QB-4PassTD_RB-0.20ppc_Reduced-PPR_DB-0.875Tackle.json', 'QB 4pt Passing TD; RB 0.20ppc; DB 3/4points - http://www65.myfantasyleague.com/2016/home/78949', allPositions);
showResultsFromExport('QB-4PassTD_RB-0.20ppc_Reduced-PPR_DB-0.875Tackle__2014.json', '2014 QB 4pt Passing TD; RB 0.20ppc; DB 3/4points - http://www65.myfantasyleague.com/2016/home/78949', allPositions);
*/

/*
showResultsFromExport('QB-4PassTD_RB-0.25ppc_DB-ReducedTackle_Enhanced-IDP.json', 'QB 4pt Passing TD; RB 0.25ppc; DB 3/4points; Enhanced IDP - http://www65.myfantasyleague.com/2016/home/55921', allPositions);
showResultsFromExport('QB-4PassTD_RB-0.25ppc_DB-ReducedTackle_Enhanced-IDP__2014.json', '2014 QB 4pt Passing TD; RB 0.25ppc; DB 3/4points; Enhanced IDP - http://www65.myfantasyleague.com/2016/home/55921', allPositions);
*/

//showResultsFromExport('test-3.json', 'QB 4pts Passing TD; TE 1pt 1Dn; Others .5pt 1Dn - DB uses LB scoring', allPositions);
//showResultsFromExport('test-4.json', 'QB 4pts Passing TD; TE 1pt 1Dn; RB .75pt 1Dn; Others .5pt 1Dn - DB uses LB scoring', allPositions);
//showResultsFromExport('test-5.json', 'QB 4pts Passing TD; TE 1pt 1Dn; RB .75pt 1Dn && 1.2 Pts/RuYd; Others .5pt 1Dn - DB uses LB scoring', allPositions);
//showResultsFromExport('test-6.json', 'QB 4pts Passing TD; TE 1pt 1Dn; Others .5pt 1Dn; RB 1.2 Pts/RuYd;  - DB uses LB scoring', allPositions);
//showResultsFromExport('test-7.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; RB .75pt 1Dn; Others .5pt 1Dn; .12pts RuYd - http://www65.myfantasyleague.com/2016/home/67040', allPositions);

//showResultsFromExport('mason-superflex-a.json', 'Mason SuperFlex A', allPositions);
//showResultsFromExport('mason-superflex-b.json', 'Mason SuperFlex B', allPositions);
//showResultsFromExport('TE-1.5PP1Dn.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; Others .5pt 1Dn - http://www65.myfantasyleague.com/2016/home/51340', allPositions);
//showResultsFromExport('TE-1.5PP1Dn__.12RuYd.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; Others .5pt 1Dn; .12pts RuYd - http://www65.myfantasyleague.com/2016/home/76467', allPositions);
//showResultsFromExport('TE-1.5PP1Dn - DB-.875Tackle.json', 'QB 4pts Passing TD; TE 1.5pt 1Dn; Others .5pt 1Dn; DB 3/4points - http://www65.myfantasyleague.com/2016/home/64009', allPositions);
//showResultsFromExport('RB-0.25ppc-test.json', 'QB 4pts Passing TD; RB 0.25ppc; DB 3/4points', allPositions);
//showResultsFromExport('QB-6PassTD_RB-0.25ppc_DB-baseline.json', 'QB 6pt Passing TD; RB 0.25ppc; DB baseline - http://www65.myfantasyleague.com/2016/home/64994', allPositions);
//showResultsFromExport('QB-4PassTD_RB-0.25ppc_DB-baseline.json', 'QB 4pt Passing TD; RB 0.25ppc; DB baseline - http://www65.myfantasyleague.com/2016/home/64525', allPositions);
