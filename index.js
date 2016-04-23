const CENTER_LAT = 35.714319570; // latitude
const CENTER_LNG = 139.760729910; // longitude
function onLoad() {
	// set the param
	var mapOptions = {
		zoom: 16, 
		center: new google.maps.LatLng(CENTER_LAT, CENTER_LNG), 
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	// make a map instance
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
