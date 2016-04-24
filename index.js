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
		zoom: 12,
		center: new google.maps.LatLng(CENTER_LAT_BOSTON, CENTER_LNG_BOSTON),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	// make a map instance
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
	showInformation(false);
}

//check the place
function showInformation(windy) {
	var place = document.getElementById("boston").checked;
	var map = new google.maps.Map(document.getElementById("map"), null);

	if(place){
		setMap(map, BOSTON_ID);
		var latlng_info = new google.maps.LatLng(CENTER_LAT_BOSTON, CENTER_LNG_BOSTON);
		getWeather(map, latlng_info, windy);
	}else{
		//focus on Tokyo
		setMap(map, TOKYO_ID);
		var latlng_info = new google.maps.LatLng(CENTER_LAT_TOKYO, CENTER_LNG_TOKYO);
		getWeather(map, latlng_info, windy);
	}
}

function onWind(){
	showInformation(true);
}


// add marker using the response
function showWeather(map, list, windy){
	var weathers = new Array();

	//console.log(list[0].coord);
	for (var i = 0; i < list.length; i++) {
		weathers[i] = new Weather(list[i].coord, list[i].weather, list[i].wind, list[i].name);
		//console.log(weathers[i]);
	}
	if(windy){
		showWind(map,weathers);
	}else{
		showState(map,weathers);
		//showWind();
	}
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
	for (var i = 0;i<weathers.length-1;i++) {
		var speed = weathers[i].wind.speed;
		var iconUrl;
		if(speed < 3.3){
			iconUrl = "https://cdn3.iconfinder.com/data/icons/badges-and-votes/60/Thumbs_up-01-32.png";
			var circle = new google.maps.Circle({
  				center: new google.maps.LatLng(weathers[i].latlng.lat, weathers[i].latlng.lon),
  				fillColor: '#00bfff',   // 塗りつぶし色
  				fillOpacity: 0.5,       // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
  				map: map,             // 表示させる地図（google.maps.Map）
  				radius: 900,          // 半径（ｍ）
 				strokeColor: '#00bfff', // 外周色
  				strokeOpacity: 1,       // 外周透過度（0: 透明 ⇔ 1:不透明）
  				strokeWeight: 1         // 外周太さ（ピクセル）
 				});

		}else if (3.3< speed < 4 ){
			iconUrl = "https://cdn2.iconfinder.com/data/icons/flat-style-svg-icons-part-1/512/warning_alert_attention_search-32.png";
			var circle = new google.maps.Circle({
  				center: new google.maps.LatLng(weathers[i].latlng.lat, weathers[i].latlng.lon),
  				fillColor: '#ffff00',   // 塗りつぶし色
  				fillOpacity: 0.5,       // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
  				map: map,             // 表示させる地図（google.maps.Map）
  				radius: 900,          // 半径（ｍ）
 				strokeColor: '#ffff00', // 外周色
  				strokeOpacity: 1,       // 外周透過度（0: 透明 ⇔ 1:不透明）
  				strokeWeight: 1         // 外周太さ（ピクセル）
 				});
		}else{
			iconUrl = "https://cdn1.iconfinder.com/data/icons/toolbar-signs/512/danger-32.png";
			var circle = new google.maps.Circle({
  				center: new google.maps.LatLng(weathers[i].latlng.lat, weathers[i].latlng.lon),
  				fillColor: '#ff0000',   // 塗りつぶし色
  				fillOpacity: 0.5,       // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
  				map: map,             // 表示させる地図（google.maps.Map）
  				radius: 900,          // 半径（ｍ）
 				strokeColor: '#ff0000', // 外周色
  				strokeOpacity: 1,       // 外周透過度（0: 透明 ⇔ 1:不透明）
  				strokeWeight: 1         // 外周太さ（ピクセル）
 				});
		}
		var icon = new google.maps.Marker({
			position: new google.maps.LatLng(weathers[i].latlng.lat, weathers[i].latlng.lon),
			map:map,
			animation: google.maps.Animation.DROP,
			icon:iconUrl
		});

	}

	var icon = new google.maps.Marker({
			position: new google.maps.LatLng(weathers[weathers.length-1].latlng.lat, weathers[weathers.length-1].latlng.lon),
			map:map,
			animation: google.maps.Animation.DROP,
			icon:"https://cdn1.iconfinder.com/data/icons/toolbar-signs/512/danger-32.png"
		});
	var circle = new google.maps.Circle({
  				center: new google.maps.LatLng(weathers[weathers.length-1].latlng.lat, weathers[weathers.length-1].latlng.lon),
  				fillColor: '#ff0000',   // 塗りつぶし色
  				fillOpacity: 0.5,       // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
  				map: map,             // 表示させる地図（google.maps.Map）
  				radius: 900,          // 半径（ｍ）
 				strokeColor: '#ff0000', // 外周色
  				strokeOpacity: 1,       // 外周透過度（0: 透明 ⇔ 1:不透明）
  				strokeWeight: 1        // 外周太さ（ピクセル）
 				});


	var center = calcBalance(weathers);
	var icon = new google.maps.Marker({
			position: center,
			map:map,
			icon:"https://cdn3.iconfinder.com/data/icons/drone-business/512/quadcopter_screw_rotation-64.png"
		});

	var circle = new google.maps.Circle({
  				center: center,
  				fillColor: '#7fff00',   // 塗りつぶし色
  				fillOpacity: 0.3,       // 塗りつぶし透過度（0: 透明 ⇔ 1:不透明）
  				map: map,             // 表示させる地図（google.maps.Map）
  				radius: 2000,          // 半径（ｍ）
 				strokeColor: '#7fff00', // 外周色
  				strokeOpacity: 1,       // 外周透過度（0: 透明 ⇔ 1:不透明）
  				strokeWeight: 1        // 外周太さ（ピクセル）
 				});

	map.setCenter(center);
}

//show the weather and return response in JSON
function getWeather(map, latlng, windy) {
	var xmlHttpRequest = new XMLHttpRequest();
	xmlHttpRequest.onreadystatechange = function()
	{
	    if( this.readyState == 4 && this.status == 200 )
	    {
	        if( this.response )
	        {
	        	//console.log(this.response.list);
	            showWeather(map, this.response.list, windy);
	        }
	    }
	}
	xmlHttpRequest.open( 'GET',"http://api.openweathermap.org/data/2.5/find?lat="+ latlng.lat() + "&lon="+latlng.lng()+"&cnt=10&appid="+ API_KEY , true );
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
		zoom: 13,
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
