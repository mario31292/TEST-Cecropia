var currentLocation = '';

function initialize() {
    currentLocation = '';
    document.querySelector('#weather').style.display = 'inline-block';
    document.querySelector('#continents').style.display = "inline-block";
    document.querySelector('#continents').innerHTML = "";
    document.querySelector('#countries').innerHTML = "";
    document.querySelector('#locations').innerHTML = "";
    document.querySelector('#countries').style.display = "none";
    document.querySelector('#locations').style.display = "none";
    document.querySelector('#addfav').style.display = "none";
    document.querySelector('#clear').style.display = "none";
    document.querySelector('.data-location').style.display = "none";
    document.querySelector('#loading').style.display = "none";
    document.body.classList.remove("hot");
    document.body.classList.remove("cold");
    reloadFavorites();
    loadContinents(); 
};

function loadContinents() {
    var continents = [
        { title: 'Africa', woeid: '24865670' },
        { title: 'Asia', woeid: '24865671' },
        { title: 'Australia', woeid: '55949069' },
        { title: 'Europe', woeid: '24865675' },
        { title: 'North_america', woeid: '24865672' },
        { title: 'South_america', woeid: '24865673'}

    ];
    document.querySelector('#continents').add(document.createElement('option'));
    for (var i = 0; i < continents.length; i++) {
        var option = document.createElement('option');
        option.text = continents[i].title;
        option.value = continents[i].woeid;
        document.querySelector('#continents').add(option);
    }
};

function loadCountries() {
    document.querySelector('#countries').innerHTML = "";
    document.querySelector('#locations').innerHTML = "";
    document.querySelector('#loading').style.display = "inline-block";
    var id_continent = document.querySelector('#continents').value;
    console.log("woeid continent: " + id_continent);
    getDataFromMetaWeather(id_continent, function (data) {
        document.querySelector('#loading').style.display = "none";
        document.querySelector('#countries').style.display = "inline-block";
        var continent = JSON.parse(data);
        console.log('continent: ' + continent.title);
        document.querySelector('#countries').add(document.createElement('option'));
        for (let i = 0; i < continent.children.length; i++) {
            var option = document.createElement('option');
            option.text = continent.children[i].title;
            option.value = continent.children[i].woeid;
            document.querySelector('#countries').add(option);
        }
        document.querySelector('#clear').style.display = "inline-block";
    });
};

function loadLocations() {
    document.querySelector('#locations').innerHTML = "";
    document.querySelector('#loading').style.display = "inline-block";
    document.querySelector('#clear').style.display = "none";
    var id_country = document.querySelector('#countries').value;
    console.log("woeid country: " + id_country);
    getDataFromMetaWeather(id_country, function (data) {
        document.querySelector('#loading').style.display = "none";
        document.querySelector('#clear').style.display = "inline-block";
        document.querySelector('#locations').style.display = "inline-block";
        var country = JSON.parse(data);
        console.log('country: ' + country.title);
        document.querySelector('#locations').add(document.createElement('option'));
        for (let i = 0; i < country.children.length; i++) {
            var option = document.createElement('option');
            option.text = country.children[i].title;
            option.value = country.children[i].woeid;
            document.querySelector('#locations').add(option);
        }
    });
};

function findLocation(id) {
    document.querySelector('#loading').style.display = "inline-block";
    document.querySelector('#clear').style.display = "none";
    var id_location = id?id:document.querySelector('#locations').value;
    console.log("woeid location: " + id_location);
    document.querySelector('.data-location').style.display = "none";
    getDataFromMetaWeather(id_location, function (data) {
        document.querySelector('#weather').style.display = 'none';
        document.querySelector('#loading').style.display = "none";
        document.querySelector('#clear').style.display = "inline-block";
        var location = JSON.parse(data);
        currentLocation = location;
        console.log('location: ' + location.title);
        console.log(location);
        if (!id) document.querySelector('#addfav').style.display = "inline-block";
        document.querySelector('.data-location').style.display = "inline-block";
        document.querySelector("#name").innerHTML = location.title + ' / ' + location.parent.title;
        document.querySelector("#temp").innerHTML = parseInt(location.consolidated_weather[0].the_temp) + '°C';
        document.querySelector("#temp-rank").innerHTML = parseInt(location.consolidated_weather[0].min_temp) + '°C / ' + parseInt(location.consolidated_weather[0].max_temp) +'°C';
        document.querySelector("#precipitation").innerHTML = 'Precipitation: '+location.consolidated_weather[0].predictability+'%';
        document.querySelector("#humidity").innerHTML = 'Humedity: ' +location.consolidated_weather[0].humidity+'%';
        document.querySelector("#wind").innerHTML = 'Wind: ' + Math.round(location.consolidated_weather[0].wind_speed) + 'mph';
        document.querySelector("#state").setAttribute('src','https://www.metaweather.com/static/img/weather/png/' + location.consolidated_weather[0].weather_state_abbr +'.png');
        document.body.classList.remove("hot");
        document.body.classList.remove("cold");
        if (parseInt(location.consolidated_weather[0].the_temp) >= 23) {
            document.body.classList.add("hot");
        }else{
            if (parseInt(location.consolidated_weather[0].the_temp) <= 15) {
                document.body.classList.add("cold");
            }
        }
    });
};

function addFavorite() {
    if (!localStorage.getItem("1title")) {
        localStorage.setItem('1title', currentLocation.title);
        localStorage.setItem('1woeid', currentLocation.woeid);
        document.querySelector('#addfav').style.display = "none";
    }else{
        if (!localStorage.getItem("2title")) {
            localStorage.setItem('2title', currentLocation.title);
            localStorage.setItem('2woeid', currentLocation.woeid);
            document.querySelector('#addfav').style.display = "none";
        }else{
            if (!localStorage.getItem("3title")) {
                localStorage.setItem('3title', currentLocation.title);
                localStorage.setItem('3woeid', currentLocation.woeid);
                document.querySelector('#addfav').style.display = "none";
            }else{
                alert("You can not add mora than 3 Favorites locations.");
            }
        }
    }
    reloadFavorites();
};

function reloadFavorites() {
    var container = document.querySelector("#favorites-list");
    container.innerHTML = '';
    for (var i = 1; i <= 3; i++) {
        if (localStorage.getItem(i + 'title')) {
            container.innerHTML += '<div><span class="option' + i + '" onclick="selectFavorite(' + i + ')">' + localStorage.getItem(i + 'title') + '</span> <img width="20px" height="20px" src="img/remove.png" onclick="remove(' + i +')"/></div>';
        }
    }
}

function selectFavorite(i) {
    findLocation(localStorage.getItem(i+'woeid'));
    document.querySelector('#addfav').style.display = "none";
}

function remove(i) {
    localStorage.removeItem(i + 'title');
    localStorage.removeItem(i + 'woeid');
    reloadFavorites();
}

function changeMeasure() {
    var chk = document.querySelector("#measure").checked;
    if (chk) {
        var min = parseInt(currentLocation.consolidated_weather[0].min_temp);
        var max = parseInt(currentLocation.consolidated_weather[0].min_temp);
        var temp = parseInt(currentLocation.consolidated_weather[0].the_temp);
        document.querySelector("#temp-rank").innerHTML = ((min * 9 / 5) + 32) + '°F / ' + ((max * 9 / 5) + 32) +'°F';
        document.querySelector("#temp").innerHTML = ((temp * 9 / 5) + 32) + '°F';     
    } else {
        document.querySelector("#temp-rank").innerHTML = parseInt(currentLocation.consolidated_weather[0].min_temp) + '°C / ' + parseInt(currentLocation.consolidated_weather[0].max_temp) + '°C';        
        document.querySelector("#temp").innerHTML = parseInt(currentLocation.consolidated_weather[0].the_temp) + '°C';        
    }
};

function getDataFromMetaWeather(woeid, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            callback(this.responseText);
        }
    };
    xhttp.open("GET", "https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/" + woeid, true);
    xhttp.send();
};