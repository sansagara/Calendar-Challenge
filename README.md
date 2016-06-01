# Calendar Challenge

This is my answer to a front-end programming challenge i got for a development position @prosoft. :computer:

## Libraries:
- JQuery: Used for AJAX call to Holidayapi service and changing the cell styles by id.
- NPM Calendar: Used for getting the weeks and days on a particular month.
- Bootstrap: Used for general page styling.
- Bootstrap DateTimePicker: Used for getting the strat date input from the user.

## How it works:
All logic is done basically on two files:

- `index.html`: This is where i get the user input via an HTML form. The form is validated with HTML5 patterns. For the date, the Bootstrap DateTimePicker library is used. When the user clicks the "Generate Calendars" button and the form is valid, an inline js script initializes the variables, validates the valid country codes and creates the date object. With that done, a call to the js function `showCalendars(startDate, numDays, country);` is made. This function is located in the next main file.

- `index.js`: This is the file where i put all my custom code. It haves two functions:
 
 - `showCalendars(startDate, numDays, country)`: This functions takes care of all the logic. It calculates the number of calendars that are going to be displayed (months) and starts a loop, where for each calendar, it renders a tables with appropiate headers, filling the day numbers where apropriate, and setting the styles for weekends and invalid (empty) days. Once a month is created, a call to the function that gets the holidays is called.

 - `showEvents(country, year, month)`: This is where an ajax call is made for each month the showCalendars function needs to render. It uses the API in holidayapi.com. For example, if needing the holidays in the US for April 2008, you need to `GET http://holidayapi.com/v1/holidays?country=US&year=2008&month=04`. Once the array of holidays are received, a loop gets the names and assigns them to the title of the row by it's unique id (named after the date).

> Note there is also some custom code for styling the table at `index.css`.

## Usage:

Just put it on a webserver and :running: it!.

## To-do:

- Make the tables use the default Bootstrap style!.

_ _ _

> &copy; Leonel Atencio