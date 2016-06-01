function showCalendars(startDate, numDays, country) {

	//The number of days to display.
	var numdays = 100;

	//Get the finish date.
	//var newDate = new Date(date.setTime( date.getTime() + days * 86400000 ));


	//The starting date day, month and year.
	var day = 5;
	var month = 4;
	var year = 2016;

	//Select the calendar div on the HTML.
	var table = d3.select('#calendar');

	//For the number of months the days will span.
	for (i=0; i<13; i++) {

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
		  .text(consts.monthNames[month]);

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
		      return 'row-' + year + '-' + ("0" + month).slice(-2) + '-' + ("0" + d).slice(-2);
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
	}

}

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
		    	$("#row-"+ holiday.date).attr('title', holiday.name);
				$("#row-"+ holiday.date).attr('class', 'holiday');

			})
        },
    });
}