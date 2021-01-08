
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

// 7days: https://api.openweathermap.org/data/2.5/onecall?lat=38&lon=127&appid=02efdd64bdc14b279bc91d9247db4722&units=metric&exclude=minutely,hourly,current


// http://openweathermap.org/img/wn/02d.png

/****************** 전역설정 *******************/
var map;
var cities;
var cityCnt = 0;	// onCreateMarker에서 갯수를 센다.
var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather';
var onecallUrl = 'https://api.openweathermap.org/data/2.5/onecall';
var params = {
	appid: '02efdd64bdc14b279bc91d9247db4722',
	units: 'metric',
	lang: 'kr',
	exclude: 'minutely,current'
}


/****************** 이벤트등록 *******************/
moment.locale('ko'); 
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
	updateDaily(r);
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
	cityCnt++;
	var city = cities.filter(function(v){
		return v.id === r.id;
	});
	var content = '';
	content += '<div class="popper '+city[0].class+'" onclick="getWeather('+city[0].id+');">';
	content += '<div class="img-wrap">';
	content += '<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
	content += '</div>';
	content += '<div class="cont-wrap">';
	content += '<div class="name">'+city[0].name+'</div>';
	content += '<div class="temp">'+r.main.temp+'˚</div>';
	content += '</div>';
	content += '<i class="fa fa-caret-down"></i>';
	content += '</div>';
	var position = new kakao.maps.LatLng(r.coord.lat, r.coord.lon); 
	var customOverlay = new kakao.maps.CustomOverlay({
		position: position,
		content: content
	});
	customOverlay.setMap(map);

	content  = '<div class="city swiper-slide" onclick="getWeather('+city[0].id+');">';
	content += '	<div class="name">'+city[0].name+'</div>';
	content += '	<div class="content">';
	content += '		<div class="img-wrap">';
	content += '			<img src="http://openweathermap.org/img/wn/'+r.weather[0].icon+'.png" class="mw-100">';
	content += '		</div>';
	content += '		<div class="cont-wrap">';
	content += '			<div class="temp">온도&nbsp;&nbsp; '+r.main.temp+'˚</div>';
	content += '			<div class="temp">체감&nbsp;&nbsp; '+r.main.feels_like+'˚</div>';
	content += '		</div>';
	content += '	</div>';
	content += '</div>';
	$('.city-wrap .swiper-wrapper').append(content);
	if(cityCnt == cities.length) {
		var swiper = new Swiper('.city-wrap > .swiper-container', {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: true,
			navigation: {
				nextEl: '.city-wrap > .bt-next',
				prevEl: '.city-wrap > .bt-prev',
			},
			breakpoints: {
				576: { slidesPerView: 3 },
				768: { slidesPerView: 4 },
			}
		});
	}
}

// format(	 'YYYY-MM-DD hh:mm:ss '		) 01시
// format(	 'YYYY-MM-DD HH:mm:ss '		) 13시
// (i == 0) ? '지금' : moment(r.hourly[i].dt*1000).format('H')+'시('+moment(r.hourly[i].dt*1000).format('D')+'일)'

function onGetWeekly(r) {
	console.log(r);
	var html;

	// Hourly
	for(var i in r.hourly) {
		html  = '<div class="swiper-slide">';
		html += '	<div class="time-wrap">'+((i == 0) ? '현재' : moment(r.hourly[i].dt*1000).format('H')+'시('+moment(r.hourly[i].dt*1000).format('D')+'일)')+'</div>';
		html += '	<div class="img-wrap">';
		html += '		<img src="http://openweathermap.org/img/wn/'+r.hourly[i].weather[0].icon+'.png" class="mw-100">';
		html += '	</div>';
		html += '	<div class="temp-wrap">'+r.hourly[i].temp+'˚</div>';
		html += '</div>';
		$('.hourly-container .swiper-wrapper').append(html);
	}
	var swiper = new Swiper('.hourly-container > .swiper-container', {
		slidesPerView: 3,
		spaceBetween: 10,
		navigation: {
			nextEl: '.hourly-container > .bt-next',
			prevEl: '.hourly-container > .bt-prev',
		},
		breakpoints: {
			576: { slidesPerView: 4 },
			768: { slidesPerView: 5 },
			992: { slidesPerView: 6 },
			1200: { slidesPerView:7 },
		}
	});


	// Weekly
	for(var i=1; i<r.daily.length; i++) {
		html  = '<div class="">';
		html += '	<div class="yoil">'+moment(r.daily[i].dt*1000).format('dddd')+'</div>';
		html += '	<div class="icon"><img src="http://openweathermap.org/img/wn/'+r.daily[i].weather[0].icon+'.png" alt="icon" class="mw-100"></div>';
		html += '	<div class="desc">'+r.daily[i].weather[0].main+'('+r.daily[i].weather[0].description+')</div>';
		html += '	<div class="max">'+r.daily[i].temp.max+'˚</div>';
		html += '	<div class="min">'+r.daily[i].temp.min+'˚</div>';
		html += '</div>';
		$('.weekly-container').append(html);
	}
	/*
	var swiper = new Swiper('.weekly-container.swiper-container', {
		slidesPerView: 1,
		direction: 'vertical',
		breakpoints: {
			576: { slidesPerView: 2 },
			768: { slidesPerView: 3 },
		}
	});
	*/
}

/****************** 사용자함수 *******************/

/* 
 */


function updateDaily(r) {
	var $city = $(".daily-container .city");
	var $imgWrap = $(".daily-container .img-wrap");
	var $tempWrap = $(".daily-container .temp-wrap");
	var $infoWrap = $(".daily-container .info-wrap");
	var src = 'http://openweathermap.org/img/wn/'+r.weather[0].icon+'@2x.png';
	$city.html(r.name + ', ' + r.sys.country);
	$imgWrap.find("img").attr('src', src); // $("img", $imgWrap).attr('src', src);
	$tempWrap.find("h3").html(r.main.temp+'˚');
	$tempWrap.find("div").html('(체감 '+r.main.feels_like+'˚)');
	$infoWrap.find("h3").html(r.weather[0].main+' <small>('+r.weather[0].description+')</small>');
	$infoWrap.find(".temp .info").eq(0).html(r.main.temp_max+'˚');
	$infoWrap.find(".temp .info").eq(1).html(r.main.temp_min+'˚');
	$infoWrap.find(".wind .arrow").css('transform', 'rotate('+r.wind.deg+'deg)');
	$infoWrap.find(".wind .info").html(r.wind.speed+'㎧');
	$infoWrap.find(".date .title").html(moment(r.dt*1000).format('YYYY년 M월 D일 H시 m분')+' 기준');
}

function getWeather(param, param2) {
	if(param && param2) {
		params.id = '';
		params.lat = param;
		params.lon = param2;
	}
	else {
		params.id = param;
		params.lat = '';
		params.lon = '';
	}
	$.get(weatherUrl, params, onGetWeather);
	$.get(onecallUrl, params, onGetWeekly);
}

function mapInit() {
	var mapOption = { 
		center: new kakao.maps.LatLng(35.8, 127.7),
		level: 13,
		draggable: false,
		zoomable: false,
		disableDoubleClick: true
	};
	map = new kakao.maps.Map($('#map')[0], mapOption);
	map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);
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