
var sync = require('sync-request');

var home

exports.setHome = (location, callback) => {
	console.log('location: '+location)
	const loc = getLatLon(location)
	console.log(loc)
	this.home = getLatLon(location)
	console.log('home set: '+this.home)
	var latLng = this.home.split(',')
	callback({lat:parseFloat(latLng[0]), lng:parseFloat(latLng[1])})
}

exports.getFare = function(destination, callback) {
	var dest = getLatLon(destination)
	console.log('home: '+this.home)
	console.log('dest: '+destination)
	const data = getRouteData(this.home, dest) // this is making the live API call
	var distance = data.routes[0].legs[0].distance.value
	console.log('distance: '+distance)
	var duration = data.routes[0].legs[0].duration.value
	console.log('duration: '+duration)
	var cost = calculateFare(distance, duration)
	callback({distance: distance, duration: duration, cost:cost})
}

/* this function returns API data but the data won't vary between calls. We could get away without mocking this call. */
function getLatLon(address) {
	var url = 'https://maps.googleapis.com/maps/api/geocode/json?region=uk&address='
	var res = sync('GET', url+address)
	data = JSON.parse(res.getBody().toString('utf8'))
	var loc = data.results[0].geometry.location
	return loc.lat.toFixed(6)+','+loc.lng.toFixed(6)
}

/* this function also returns live API data but this data will vary continously based on time of day and traffic conditions. This means it will require mocking in tests. by storing the function in a private variable we can substitute for a different function when testing. Because we are replacing the code block it will never be called by our test suite so we flag the code coverage tool to ignore it. */
/* istanbul ignore next */
var getRouteData = function(start, end) {
	var url = 'https://maps.googleapis.com/maps/api/directions/json?origin='
	url = url+start+'&destination='+end
	console.log(url)
	const res = sync('GET', url)
	return JSON.parse(res.getBody().toString('utf8'))
}

function calculateFare(distance, duration) {
	var cost = distance*1 + duration*0.1
	return cost.toFixed(2)
}
