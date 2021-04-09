// Global objects
let map = null;         // Mapbox GL object
let dateList = null;    // List of dates to filter by
let maxPropValForColorCode = 0; // Max cases to determine the min and max for gradient
let currentDate = '';       // Current day determined from the slider
let currentDayValue = 0;    // Numerical value of current day determined from the slider
let colorCodeProperty = config.county_props.CASES;
let latestDateValue;
let lastDayElapsed;
let popup;
const mapStyle = 'mapbox://styles/mapbox/dark-v10';
const countKey = config['ccd']['count'];
const daysElapsedKey = config['ccd']['daysElapsed'];
const FETCH_RETRY_LIMIT = 3;
const htmlElements = {
    slider: document.getElementById("slider"),
    sliderToolbar: document.getElementById("map-overlay-inner"),
    maxCasesDiv: document.getElementById("cases-max"),
    dateLabel: document.getElementById("map-date"),
    infoTable: document.getElementById("info-table-container"),
    searchBox:document.getElementById('filter-box'),
    countyName:document.getElementById('county-name')

}

// initializer functions -------------------------------------------------------
// main initializer
async function mainInit() {
    const currentURL = new URL(window.location);
    let mapboxTokenPromise = {"token": currentURL.searchParams.get("mapboxAPIToken")};
    response = await mapboxTokenPromise;
    drawBlankMap(response.token);

    displayFooterMessage("Loading initial county data, please wait...", false);
    loadInitialData(geoJson, countyCases, colorCodes);
}

function drawBlankMap(token) {
    mapboxgl.accessToken = token
    map = new mapboxgl.Map({
        container: 'map',
        style: mapStyle,
        center: [-89.3985, 40.6331],
        zoom: 7,
        minZoom: 3.5,
        maxZoom: 12
    });
}

// ajax call to populate county data with formated filter
function loadInitialData(geoJson, countyCases, colorCodes) {
    let counties = countyCases.collection
    lastDayElapsed = countyCases.lastAvailableDay;

    for (var countyIndex = 0; countyIndex < counties.length; countyIndex++) {
        var geoid = geoJson.features[countyIndex].properties.GEO_ID;
        // just a double check if theres an inconsitency in data, we really just wanna break out of the loop
        if (geoid != counties[countyIndex][config['ccd']['GEO_ID']]) {
            displayFooterMessage("An error occured with combining erics data.", true);
            console.log(geoid);
            break;
        }
        else {
            county = counties[countyIndex];
            //For a property whose value decides the color codes
            addColorCodes(geoJson, county, colorCodeProperty, colorCodes, lastDayElapsed);

            geoJson.features[countyIndex].properties['confirmed_cases'] = county[config['ccd']['confirmed_cases']];
            geoJson.features[countyIndex].properties['deaths'] = county[config['ccd']['deaths']];
            geoJson.features[countyIndex].properties['strain_data'] = county[config['ccd']['strain_data']];
        }
    }
    displayFooterMessage("Background loading complete. Map is fully ready.", false);

    latestDateValue = addToDate(startDate, lastDayElapsed)
    initMap(geoJson);
    updateToolbarLimits();

    //Local function
    function addColorCodes(geoJson,county, colorCodeProperty, colorCodes, lastDayElapsed) {
        prop = county[config['ccd'][colorCodeProperty]];
        if (prop.length <= 0) {
            return;
        }
        let colorCode;
        // iterate from the first day in cases until today
        for (let propIndex = 0; propIndex < prop.length; propIndex++) {
            let daysElapsed = prop[propIndex][daysElapsedKey];
            let caseCount = prop[propIndex][countKey];
            maxPropValForColorCode = Math.max(caseCount, maxPropValForColorCode);
            colorCode = getColorCode(colorCodes, caseCount);

            // next date where number of cases is changed
            let nextAvailableDay = (propIndex < prop.length - 1) ? prop[propIndex + 1][daysElapsedKey] : lastDayElapsed;
            while (daysElapsed <= nextAvailableDay) {
                //Making colorcode as a property in the county object (required for mapbox)
                geoJson.features[countyIndex].properties[daysElapsed + "_color"] = colorCode;
                daysElapsed++;
            }
        }
    }
}

function updateToolbarLimits() {
    htmlElements.maxCasesDiv.textContent = niceNumber(maxPropValForColorCode);
    dateList = getDateArray(latestDateValue);
    htmlElements.slider.max = dateList.length - 1;
    htmlElements.slider.value = date_diff_indays(startDate, latestDateValue);
}


// initializes map
function initMap(geoJson) {
    map = new mapboxgl.Map({
        container: 'map',
        style: mapStyle,
        center: [-89.651607, 39.781232],
        zoom: 6,
        minZoom: 3.5,
        maxZoom: 12,
        dragRotate: false,
        touchZoomRotate: false
    });

    popup = new mapboxgl.Popup({
        closeButton: false
    });
    let markers = [];

    // county geometry
    const countyLayerGeometry = {
        'id': 'county-layer',
        'type': 'fill',
        'source': 'county',
        'paint': {
            'fill-outline-color': 'rgba(50, 0, 50, 0.3)',
            'fill-opacity': 0.4
        }
    };

    // init of map with blank geojson
    map.on('load', function () {
        map.addSource('county', { 'type': 'geojson', 'data': geoJson });
        map.addLayer(countyLayerGeometry);
        map.setPaintProperty("water","fill-color",'#00243D');
        map.on('mousemove', 'county-layer', function (e) {
            // Change the cursor style as a UI indicator.
            map.getCanvas().style.cursor = 'pointer';
            let strainData = JSON.parse(e.features[0].properties.strain_data)
            document.getElementById('info-table-container').innerHTML = populateInfoBox(e.features[0].properties.NAME, strainData);
            popup
                .setLngLat(e.lngLat)
                .setHTML(getPopupContent(e.features[0]))
                .addTo(map);
        });
        map.on('mouseleave', 'county', resetPopupProperties);
        map.on('mouseenter', 'county', resetPopupProperties);

        // filter listener
        htmlElements.slider.addEventListener('input', e => filterBy(e.target.value));

        // filter by initial slider position
        if (dateList) {
            filterBy(lastDayElapsed);
            htmlElements.sliderToolbar.style.visibility = "visible";
        }

        htmlElements.searchBox.addEventListener('keyup', function (e) {
            markers.forEach(marker=>marker.remove());
            resetPopupProperties();
            var value = normalize(e.target.value);
            let selectedCounty='Search for counties';
            // Filter visible features that don't match the input value.
            let filtered = [];
            if (value) {
                filtered = geoJson.features.filter(function (feature) {
                    var name = normalize(feature.properties.NAME);
                    return name.startsWith(value);
                });
                if(filtered.length){
                    selectedCounty=filtered[0].properties.NAME;
                    map.flyTo({center:filtered[0].properties.coords, speed:0.5, curve:0});
                }
                else{
                    selectedCounty = "No such county exists";
                }
            }
            htmlElements.countyName.innerText = selectedCounty;
            filtered.filter(feature => feature.properties.NAME==selectedCounty).forEach(feature=>{
                let coords =feature.properties.coords;
                let newMarker = new mapboxgl.Marker({color:'black'});
                newMarker.setLngLat(coords)
                .addTo(map);
                markers.push(newMarker);
            });

        });
    }); // eof map.onLoad


} // eof initMap


function getPopupContent(feature) {

    let casesConfirmed,deathsConfirmed;
    // Start the popup string
    let stringBuilder = "<strong class=\"map-info-box-title\">" + feature.properties.NAME + "</strong>";
    casesConfirmed = JSON.parse(feature.properties['confirmed_cases']);
    stringBuilder += "<div class=\"map-info-box\">" + currentDate;
    let currentCaseElement = getCurrentElement(casesConfirmed);
    if (currentCaseElement) {
        stringBuilder += "<br><strong>Confirmed Cases:</strong> " + niceNumber(currentCaseElement[countKey]);
        let currentDeathElement = null;
        // grab our deaths array - we get deaths only if we have cases.
        deathsConfirmed = JSON.parse(feature.properties['deaths']);
        currentDeathElement = getCurrentElement(deathsConfirmed);
        if (currentDeathElement) {
            stringBuilder += "<br><strong>Deaths:</strong> " + niceNumber(currentDeathElement[countKey]);
        }
        else {
            stringBuilder += "<br>No deaths in this county.";
        }
    }
    else {
        stringBuilder += "<br>There are no reported cases on this day.";
    }
    stringBuilder += "</div>";
    return stringBuilder



}

function resetPopupProperties() {
    map.getCanvas().style.cursor = '';
    popup.remove();
}

function normalize(string) {
    return string.trim().toLowerCase();
}

function getCurrentElement(propList) {
    let currentElement = null;
    if (propList && propList.length > 0) {
        propList.forEach((element, index) => {
            if (element[daysElapsedKey] < currentDayValue) {
                currentElement = element;
            }
        });
    }
    return currentElement;
}

// Update the colors of map based on selected date
function filterBy(date) {
    date_color = date + "_color"
    map.setPaintProperty('county-layer', 'fill-color',
        [
            "case",
            ["!=", ["get", date_color], null], ["get", date_color],
            "rgba(0,0,0,0)"
        ]
    );
    currentDayValue = dateList[date];
    currentDate = niceDate(addToDate(startDate, dateList[date]));
    htmlElements.dateLabel.textContent = currentDate;
    resetPopupProperties();
}

function populateInfoBox(countyName, strainData){
    let currentStrainElement = getCurrentElement(strainData);
    htmlElements.infoTable.style.display='block';
    let stringBuilder = "";
    if (currentStrainElement) {
        stringBuilder+="<table class='info-table'> <th colspan=2><strong color='red'>"+countyName+"</strong><br><strong>Strain Data</strong></th>";
        stringBuilder+="<tr><td><strong> Strain Type </strong></td><td> Count </td><tr>"
        for (strain in currentStrainElement) {
            if (strain != daysElapsedKey) {
                stringBuilder += "<tr><td><strong>" + strain + " </strong></td><td> " + niceNumber(currentStrainElement[strain]) + "</td><tr>";
            }
        }
        stringBuilder += "</table>";
    }
    else{
        stringBuilder+="<div class='no-strain' align='center'><strong>"+countyName+"</strong><br><strong>No Strain Data</strong></div>";
    }
    return stringBuilder;
}

//-------------------------------------------------------------

async function fetch_retry(url, attempts) {
    try {
        let response = await fetch(config.standalone + url + ".json");
        if (response.status != 200) {
            throw response.statusText;
        }
        return await response.json();
    }
    catch (err) {
        if (attempts == 0) {
            displayFooterMessage("An error occured while fetching data from the server.", true);
            throw err;
        }
        return fetch_retry(url, attempts - 1);

    }

}
// call methods -------------------------------------------
mainInit();
