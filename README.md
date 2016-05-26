Scoring by Position Analysis
----------------------------

Silly little script to tell how many of each position are in the Top (X) of scorers.  

Uses an import.io feed of the MFL top performers page, because I need a full season's stats but I can't generate a test league from last year and the MFL export for scoring doesn't allow year selection.


So far my process has been to:

1. Create a Test league on MFL
2. Make changes to scoring settings and wait for the scoring to update on the site.
3. Log in to import.io and use the Magic API to pull down the full top performers report
    - e.g. http://www65.myfantasyleague.com/2016/top?L=64496&SEARCHTYPE=BASIC&COUNT=500&YEAR=2015&START_WEEK=1&END_WEEK=17&CATEGORY=overall&POSITION=*&DISPLAY=points&TEAM=*
4. "Export" the results using the "Simple API integration" option.
    - _This process is probably wrong.  Using the simple JSON extract would be simpler.  I was hoping to actually use the import.io APIs, but have ended up just maintaining the export files instead._
    - _The code would have to be changed since the export JSON schema is different ( not dramatically ) and the exports would have to be re-downloaded, but this would be a valuable exercise if this junky little program ends up with any longevity._
