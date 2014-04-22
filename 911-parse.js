/** @TODO Add more robust parsing of HTML **/
/** @TODO Add more robust matching of ISO code **/      		



var jsdom = require('jsdom');
var fs 	  = require('fs');
var htmlSrc;
var isoSrc;

fs.readFile('911.html', {encoding: 'utf-8'}, function (err, data) {
  if (err) throw err;
  htmlSrc = data;
  parse();
});

fs.readFile('iso-3166.json', {encoding: 'utf-8'}, function (err, data) {
  if (err) throw err;
  isoSrc = JSON.parse(data);
});

var countrymap = {
  'Ascension Island' : '',
  'Azores' : '',
  'Bali' : '',
  'Bolivia' : '',
  'Bonaire' : '',
  'Bosnia-Herzegovina' : '',
  'Bosnia' : '',
  'British Virgin Islands' : '',
  'Brunei' : '',
  'Burma' : '',
  'Cambodia, The Kingdom of' : '',
  'Canary Islands' : '',
  'China, The People\'s Republic of' : '',
  'Columbia' : '',
  'Comoros Islands' : '',
  'Congo, Democratic Republic of' : '',
  'Dominica, Commonwealth of' : '',
  'East Timor' : '',
  'Easter Island' : '',
  'England' : '',
  'Faeroe Islands' : '',
  'Falkland Islands' : '',
  'Gaborone' : '',
  'Gambia, The' : '',
  'Herzegovina' : '',
  'Iran' : '',
  'Ireland, Republic of' : '',
  'Kosovo' : '',
  'Korea, The Democratic People\'s Republic of' : '',
  'Korea, The Republic of' : '',
  'Laos' : '',
  'Macau' : '',
  'Macedonia, Republic of' : '',
  'Madeira' : '',
  'Maldives Republic' : '',
  'Marianas Island' : '',
  'Menorca' : '',
  'México' : '',
  'Moldavia' : '',
  'Moyotte' : '',
  'Netherlands Antilles' : '',
  'Northern Ireland' : '',
  'Palestine' : '',
  'Pitcairn Islands' : '',
  'Russia' : '',
  'Sabah' : '',
  'São Tomé and Principe' : '',
  'Scotland' : '',
  'Scilly, Isles of' : '',
  'Slovak Republic' : '',
  'S. Georgia Is.' : '',
  'Srpska, Republic of' : '',
  'Saint Eustatius' : '',
  'Saint Eustatius' : '',
  'Saint Helena' : '',
  'Saint Maarten' : '',
  'Tahiti - French Polynesia' : '',
  'Taiwan' : '',
  'Tanzania' : '',
  'Tibet' : '',
  'US Virgin Islands' : '',
  'Vatican City' : '',
  'Venezuela' : '',
  'Vietnam' : '',
  'Wake Island' : '',
  'Western Samoa' : '',
  'Yemen, Republic of' : '',
};



/* @TODO - add better matching */
var mapName = function (name) {
	for (var i =0; i<isoSrc.length; i++) {
		if (isoSrc[i].name == name) {
			return isoSrc[i]['alpha-2'];
		}
	}
	return false;
};

var parse = function () {

	jsdom.env({
		html: htmlSrc,
		scripts: [
		    'http://ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js'
    ],
    done: function (err,window) {
	var $ = window.jQuery;

	var countries = [];
	var country, isocode;
	var country_extra;
	var numbers;
	var country_cells = $('td[rowspan=1]');
	var phone_cells;

	country_cells.each(function (i, country_cell) {
		country = $(country_cell).html().trim();
		country_extra = country.match(/\/.*/);
		if (!country_extra) {
			country_extra = country.match(/\(.*\)/);
		}
		if (country_extra) {
			country = country.substring(0,country_extra.index);
			country_extra = country_extra[0].substring(1).trim();
		}

		country = country.replace(/\&amp;/g,'and');
		country = country.replace(/St\ /g,'Saint ');

		country = country.trim();
		phone_cells = $(country_cell).siblings();

		ambulance = fire = police = $(phone_cells)[0];
		if ($(phone_cells).length == 3) {
			fire 	  = $(phone_cells)[1];
			police    = $(phone_cells)[2];			
		}

		numbers = [ambulance, fire, police];
		for (var i=0; i<numbers.length; i++) {
			var inner = $(numbers[i]);
			if (inner.children('p').length) {
				inner = inner.children('p')[0];
			}
			numbers[i] = $(inner).clone().children().remove().end().text().trim();
		}
      		
		

      		isocode = mapName(country);

		/** @TODO - add mapping for country here **/ 

		if (!isocode) console.log (country);
      		countries.push ({
      			'name' : country,
			'extra' : country_extra,
      			'isoalpha-2' : isocode || 'XX',
      			'numbers'    : {
      				'police'    : numbers[0],
      				'fire' 	    : numbers[1],
      				'ambulance' : numbers[2]
      			}
      		});
      });
      
      fs.writeFile("911.json", JSON.stringify(countries), function(err) {
          if(err) {
              console.log(err);
          } else {
              console.log("The file was saved!");
          }
      }); 
	}
  });
}
