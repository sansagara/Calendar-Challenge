//Main function. This creates calendars according to the challenge.
function showCalendars(startDate, numDays, country) {

	//Get and test the STARTING DATE day, month and year.
	var day = startDate.getUTCDate();
	var month = startDate.getUTCMonth();
	var year = startDate.getUTCFullYear();

	//Get the FINISH DATE from the startDate and the numDays.
	var endDate = new Date();
	endDate.setTime( startDate.getTime() + numDays * 86400000 )

	//Get the number of months between startDate and endDate.
	var numMonths = monthDiff(startDate, endDate);

	//Log to check everything is OK.
	console.log("startDate: "+ startDate);
	//console.log("startDay: "+ day);
	//console//.log("startMonth: "+ month);
	//console.log("startYear: "+ year);
	console.log("- - -");
	console.log("endDate: "+ endDate);
	console.log("- - -");
	console.log("numMonths: "+ numMonths);
	console.log("- - -");
	console.log("country: "+ country);
	console.log("- - -");

	//Select the calendar div on the HTML.
	var table = d3.select('#calendar');

	//For the number of months the days will span... A loop will take place, rendering each calendar.
	for (i=0; i<numMonths; i++) {

		var cal = new Calendar();
		var weeks = cal.monthDays(year, month);

		//Append the table header, body and some space after.
		var header = table.append('thead');
		var body = table.append('tbody');
		var spacer = table.append('br');

		//Create the header for the month name.
		header
		  .append('tr')
		  .append('td')
		  .attr('colspan', 7)
		  .style('text-align', 'center')
		  .style('font-weight', 'bold')
		  .text(consts.monthNames[month] + " " + year);

		//Create the header for the day names.
		header
		  .append('tr')
		  .selectAll('td')
		  .data(consts.dayNames)
		  .enter()
		  .append('td')
		  .style('text-align', 'center')
		  .text(function (d) {
		    return d;
		  });

		//Create the calendar days. This loops each week array, which contains 7 ints, representing the day of the month.
		var dayNumber = 0;
		weeks.forEach(function (week) {
		  body
		    .append('tr')
		    .selectAll('td')
		    .data(week)
		    .enter()
		    .append('td')
		    .attr('id', function (d) {
		      return 'row-' + year + '-' + ("0" + (month+1)).slice(-2) + '-' + ("0" + d).slice(-2);
		    })
		    .attr('class', function (d) {
		      dayNumber++;
		      var invalid = '';
		      if (d == 0) {invalid = 'invalid';}
		      return dayNumber%7 == 0 || dayNumber%7 == 1 ? 'weekend ' + invalid : 'weekday ' + invalid;
		    })
		    .text(function (d) {

		      return d > 0 ? d : '';
		    })
		});

		//A call to get the holidays for this particular country, year and month. (A new call is made for each and every month the function will span)
		showEvents(country, year, month);

		//Handle month and year increments.
		if (month < 11) {
			month++;
		} else {
			month = 0;
			year++;	
		}
	} //end for loop.

	//Set invalid days prior to starting date.
	setInvalidPrev(startDate);

	//Set invalid days next to finish date.
	setInvalidFut(endDate);
}

//Function to get holidays and show them on calendar.
function showEvents(country, year, month) { 
	//Make AJAX call to holidayapi.com, passing corresponding data via GET.
	 $.ajax({
        url: 'http://holidayapi.com/v1/holidays?country=' + country + '&year=' + year + '&month=' + month,
        type: 'get',
        dataType: 'json',
        success: function (data) {
        	//Loop holidays array.
        	$(data.holidays).each(function(i, holiday) {
			    console.log('Got holidayapi for month '+ month + ' data: ' + holiday.name + ' on ' + holiday.date);
			    //Set the class and title to matchind tds.
		    	$("#row-"+ holiday.date).attr('title', holiday.name + ' (' + country + ')');
				$("#row-"+ holiday.date).addClass('holiday'); //add the class, because day may be invalid, and that haves greater importance.

			})
        },
        error: function (jqXHR, textStatus, errorThrown) {
        		console.log('ERROR - holidayapi returned error: '+ textStatus + ". Is country code valid?");
        }
    });
 }

//Helper function to calculate the difference in months between two dates d1 and d2.
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth() + 1; //+1 because i always need to show current month!.
    return months <= 0 ? 0 : months;
}

//Helper function to set all previous days as invalid on a single month.
function setInvalidPrev(date) {
	var day = date.getUTCDate() -1; //-1 so it doesnt include first day.
	var month = date.getUTCMonth();
	var year = date.getUTCFullYear();

	for (i=day; i>0; i--) {
		date = year + '-' + ("0" + month).slice(-2) + '-' + ("0" + i).slice(-2);
		$("#row-" + date).attr('class', 'invalid');
	}
}

//Helper function to set all future days as invalid on a single month.
function setInvalidFut(date) {
	var day = date.getUTCDate() +1; //+1 so it doenst include last day.
	var month = date.getUTCMonth() +1; //+1 to compensate for month starting at 0.
	var year = date.getUTCFullYear();

	for (i=day; i<=31; i++) {
		date = year + '-' + ("0" + month).slice(-2) + '-' + ("0" + i).slice(-2);
		$("#row-" + date).attr('class', 'invalid');
	}
}