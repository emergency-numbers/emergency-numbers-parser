var jsdom = require('jsdom');
var fs 	  = require('fs');
var htmlSrc;

fs.readFile('911.html', {encoding: 'utf-8'}, function (err, data) {
  if (err) throw err;
  htmlSrc = data;
  parse();
});

var parse = function () {

	jsdom.env({
		html: htmlSrc,
		scripts: [
		    'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'
    ],
    done: function (err,window) {
      var $ = window.jQuery;

      var tables = $('table');

      var countries = [];
      
      var country;
      var police, fire, ambulance;
      
      tables.each(function (i, table) {
      	var rows = $(table).find('tr');
      	var row, cells, cell;
      	
      	for (var j=0; j<rows.length; j++) {
      		row = rows[j];
      		cells = $(row).find('td > p');
      		firstcell = $(cells[0]).html() || "";
      		
      		if (firstcell == '&nbsp;' 
      	  	|| firstcell == 'Country'
      	  	|| firstcell.length <= 1) {
      			continue;
      	  }
      		// We have a match on country;
      			
      		country = firstcell;
      		police = fire = ambulance = null;

      		ambulance = cells[1];
      		fire 		  = cells[2];
      		police    = cells[3];
      		
      		if (ambulance && ambulance.innerHTML != '&nbsp;')
      			ambulance = ambulance.innerHTML;
      		else 
      			ambulance = null;
      		
      		if (fire && fire.innerHTML != '&nbsp;')
            fire = fire.innerHTML;
      		else 
      			fire = ambulance;

      		if (police && police.innerHTML != '&nbsp;')
      		  police = police.innerHTML;
      		else
      			police = fire;
      		
      		ambulance = ambulance || fire || police;
      		fire = fire || police;
      		
      		countries.push ({
      			'name' 			: country,
      			'police' 		:	police,
      			'fire' 			: fire,
      			'ambulance' : ambulance
      		});
      	}
      });
      
  	  console.log (countries);
		}
  });
}
