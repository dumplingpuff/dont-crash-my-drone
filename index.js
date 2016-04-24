const CENTER_LAT_TOKYO = 35.714319570; // latitude in Tokyo
const CENTER_LNG_TOKYO = 139.760729910; // longitude in Tokyo
const CENTER_LAT_BOSTON = 42.360772; // lat of MIT
const CENTER_LNG_BOSTON = -71.094363; // lon of MIT
const BASE_URL = "http://api.openweathermap.org/data/2.5/forecast";
const API_KEY = "885cfd6b7ff2244bb4608152e7e54064";
const BOSTON_ID = 1;
const TOKYO_ID = 2;

//weather class 
function Weather(latlng, state, wind, city){
	this.latlng = latlng;
	this.state = state;
	this.wind = wind;
	this.city = city;
}


function onLoad() {
	// set the param
	//showWeather();
	var mapOptions = {
		zoom: 14, 
		center: new google.maps.LatLng(CENTER_LAT_BOSTON, CENTER_LNG_BOSTON), 
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	// make a map instance
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	showInformation();
}	

//check the place
function showInformation() {
	var place = document.getElementById("boston").checked;
	var map = new google.maps.Map(document.getElementById("map"), null);

	if(place){
		setMap(map, BOSTON_ID);
		var latlng_info = new google.maps.LatLng(CENTER_LAT_BOSTON, CENTER_LNG_BOSTON);
		getWeather(map, latlng_info);
	}else{
		//focus on Tokyo
		setMap(map, TOKYO_ID);
		var latlng_info = new google.maps.LatLng(CENTER_LAT_TOKYO, CENTER_LNG_TOKYO);
		getWeather(map, latlng_info);
	}
}

// add marker using the response
function showWeather(map, list){
	var weathers = new Array();

	//console.log(list[0].coord);
	for (var i = 0; i < list.length; i++) {
		weathers[i] = new Weather(list[i].coord, list[i].weather, list[i].wind, list[i].name);
		//console.log(weathers[i]);
	}
	showState(map,weathers);
	//showWind();
}

function showState(map, weathers){
	for (var i = 0;i<weathers.length;i++) {
		var test = weathers[i].state[0];
		console.log(test);
		var state = weathers[i].state[0].description;
		var iconId = weathers[i].state[0].icon;

		console.log(iconId);

		var icon = new google.maps.Marker({
			position: new google.maps.LatLng(weathers[i].latlng.lat, weathers[i].latlng.lon),
			map:map,
			animation: google.maps.Animation.DROP,
			icon:"http://openweathermap.org/img/w/"+iconId+".png",
			title:state
		});
	}

	var center = calcBalance(weathers);
	map.setCenter(center);
}

function showWind(map, weathers){

}

//show the weather and return response in JSON
function getWeather(map, latlng) {
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = function()
	{
	    if( this.readyState == 4 && this.status == 200 )
	    {
	        if( this.response )
	        {
	        	//console.log(this.response.list);
	            showWeather(map, this.response.list);
	        }
	    }
	}
	xmlHttpRequest.open( 'GET',"http://api.openweathermap.org/data/2.5/find?lat="+ latlng.lat() + "&lon="+latlng.lng()+"&cnt=4&appid="+ API_KEY , true );
	xmlHttpRequest.responseType = 'json';
	xmlHttpRequest.send( null );
}

// set map
function setMap(map, city){
	var latlng;
	switch(city){
		case BOSTON_ID:
			latlng = new google.maps.LatLng(CENTER_LAT_BOSTON, CENTER_LNG_BOSTON);
			break;
		case TOKYO_ID:
			latlng = new google.maps.LatLng(CENTER_LAT_TOKYO, CENTER_LNG_TOKYO);
			break;
		default:
			break;
	}

	var mapOptions = {
		zoom: 14, 
		center: latlng, 
		mapTypeId: google.maps.MapTypeId.ROADMAP
		};
	map.setOptions(mapOptions);
}

function calcBalance(points) {
	var latTotal = 0;
	var lngTotal = 0;
	
	for (var i = 0; i < points.length; i++) {
		latTotal += points[i].latlng.lat;
		lngTotal += points[i].latlng.lon;
	}

	var glat = latTotal / points.length;
	var glng = lngTotal / points.length;

	return new google.maps.LatLng(glat, glng);
}