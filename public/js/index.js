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


// http://openweathermap.org/img/wn/02d.png

/****************** 전역설정 *******************/
var map;
var cities;
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
var params = {
	appid: '02efdd64bdc14b279bc91d9247db4722',
	units: 'metric',
	lang: 'kr'
}


/****************** 이벤트등록 *******************/
navigator.geolocation.getCurrentPosition(onGetPosition, onGetPositionError);
mapInit();




/****************** 이벤트콜백 *******************/
function onResize() {
	map.setCenter(new kakao.maps.LatLng(35.8, 127.7));
}

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

function onGetCity(r) {
	//createMarker(r.cities);
	// 변경할 사항은 위의 createMarker를 실행하지 않고, openweathermap 통신으로 날씨정보를 받아오는게 완료되면 그때 그 정보로 marker를 만든다.
	cities = r.cities;
	for(var i in cities) {
		params.lat = '';
		params.lon = '';
		params.id = cities[i].id;
		$.get(weatherUrl, params, onCreateMarker);
	}
}

function onCreateMarker(r) {
	/* for(var i in cities) {
		if(cities[i].id === r.id) {
			r.cityName = cities[i].name;
			break;
		}
	} */
	var city = cities.filter(function(v){
		return v.id === r.id;
	});
	console.log(city[0], r);
	var content = '';
	content += '<div class="popper '+city[0].class+'">';
	content += '<div class="img-wrap">';
	content += '<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
	content += '</div>';
	content += '<div class="cont-wrap">';
	content += '<div class="name">'+city[0].name+'</div>';
	content += '<div class="temp">'+r.main.temp+'도</div>';
	content += '</div>';
	content += '<i class="fa fa-caret-down"></i>';
	content += '</div>';
	var position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon); 
	var customOverlay = new kakao.maps.CustomOverlay({
		position: position,
		content: content
	});
	customOverlay.setMap(map);

	content  = '<div class="city swiper-slide">';
	content += '<div class="name">'+city[0].name+'</div>';
	content += '<div class="content">';
	content += '<div class="img-wrap">';
	content += '<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
	content += '</div>';
	content += '<div class="cont-wrap">';
	content += '<div class="temp">온도&nbsp;&nbsp; '+r.main.temp+'도</div>';
	content += '<div class="temp">체감&nbsp;&nbsp; '+r.main.feels_like+'도</div>';
	content += '</div></div></div>';
	$('.city-wrap .swiper-wrapper').append(content);
	var swiper = new Swiper('.city-wrap', {
		
	});
}



/****************** 사용자함수 *******************/

function getWeather(lat, lon) {
	params.id = '';
	params.lat = lat;
	params.lon = lon;
	$.get(weatherUrl, params, onGetWeather);
}

function mapInit() {
	var mapOption = { 
		center: new kakao.maps.LatLng(35.8, 127.7),
		level: 13,
		draggable: false,
		zoomable: false
	};
	map = new kakao.maps.Map($('#map')[0], mapOption);
	// map.setDraggable(false);
	// map.setZoomable(false);
	
	$(window).resize(onResize);
	$.get('../json/city.json', onGetCity);
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