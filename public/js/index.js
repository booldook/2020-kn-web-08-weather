// function a(arg, arg2) {}
// arguments, parameters, 인자, 매개변수 ...

// $.get(url, cb);
// $.get(url, params(쿼리를 객체형태로 전송), cb);


// 웹사이트 주소체계: https://nodejs.org/dist/latest-v15.x/docs/api/url.html

// AJAX 통신
/*
var url = 'https://api.openweathermap.org/data/2.5/onecall?lat=38&lon=127&appid=02efdd64bdc14b279bc91d9247db4722&units=metric&exclude=minutely,hourly';
function onGet(r) {
	console.log(r);
}

$("#bt").click(function(){
	$.get(url, onGet);
});
*/

// openweathermap: 02efdd64bdc14b279bc91d9247db4722 (본인거로)
// kakao: af4cf501855e85f0b321e3766472a99d (본인거로)

// 7days: https://api.openweathermap.org/data/2.5/onecall?lat=38&lon=127&appid=02efdd64bdc14b279bc91d9247db4722&units=metric&exclude=minutely,hourly


/****************** 전역설정 *******************/
var map;
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
var params = {
	appid: '02efdd64bdc14b279bc91d9247db4722',
	units: 'metric',
	exclude: 'minutely,hourly'
}


/****************** 이벤트등록 *******************/
navigator.geolocation.getCurrentPosition(onGetPosition, onGetPositionError);

mapInit();



/****************** 이벤트콜백 *******************/
function onGetPosition(r) {
	getWeather(r.coords.latitude, r.coords.longitude);
}

function onGetPositionError(e) {
	getWeather(37.566679, 126.978413);
}

function onGetWeather(r) {
	console.log(r);
	console.log(r.weather[0].icon);
	updateBg(r.weather[0].icon);
}


/****************** 사용자함수 *******************/
function getWeather(lat, lon) {
	params.lat = lat;
	params.lon = lon;
	$.get(weatherUrl, params, onGetWeather);
}

function mapInit() {
	var mapContainer = document.getElementById('map'),
	mapOption = { 
		center: new kakao.maps.LatLng(35.8, 127.8),
		level: 13
	};
	map = new kakao.maps.Map(mapContainer, mapOption); 
}

function updateBg(icon) {
	var bg;
	switch(icon) {
		case '01d':
		case '02d':
			bg = '01d-bg.jpg';
			break;
		case '01n':
		case '02n':
			bg = '01n-bg.jpg';
			break;
		case '03d':
		case '04d':
			bg = '03d-bg.jpg';
			break;
		case '03n':
		case '04n':
			bg = '03n-bg.jpg';
			break;
		case '09d':
		case '10d':
			bg = '09d-bg.jpg';
			break;
		case '09n':
		case '10n':
			bg = '09n-bg.jpg';
			break;
		case '11d':
			bg = '11d-bg.jpg';
			break;
		case '11n':
			bg = '11n-bg.jpg';
			break;
		case '13d':
			bg = '13d-bg.jpg';
			break;
		case '13n':
			bg = '13n-bg.jpg';
			break;
		case '50d':
			bg = '50d-bg.jpg';
			break;
		case '50n':
			bg = '50n-bg.jpg';
			break;
	}
	$(".all-wrapper").css('background-image', 'url(../img/'+bg+')');
}