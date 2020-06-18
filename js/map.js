mapboxgl.accessToken = 'pk.eyJ1IjoiZGltYm9kdW1ibyIsImEiOiJjamplN2t4dXYxaDY2M2twOTQzMXNocjc2In0.g9BJj267dR8RBxBBgi2fyQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-74.5, 40],
    zoom: 9,
    interactive: false
});

var compass = new mapboxgl.NavigationControl({
    showZoom: false,
    visualizePitch: false
});
map.addControl(compass, 'top-right');

var distanceContainer = document.getElementById('distance');

// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
Number.prototype.mod = function (n) {
    return ((this % n) + n) % n;
};



const ANIMATION_DURATION = 2000;

/**
 * sets js to sleep
 * function that uses sleep must be declared async
 * @param {Number} milliseconds
 * @see https://www.sitepoint.com/delay-sleep-pause-wait/
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function resetPosition() {
    map.jumpTo({
        center: [-74.5, 40],
        zoom: 9,
        pitch: 0,
        bearing: 0
    });
}


async function doStuff() {
    next();
}

function doStuff2() {
    sateliteBasemap();
}

function doStuff3() {
    setPoint();
}

/*
BASIC INTERACTIONS
*/

function accept() {
    let popup = document.getElementById("positiv");
    popup.style.top = "50%";
    popup.style.visibility = "visible";
}

function reject() {
    let popup = document.getElementById("negativ");
    popup.style.top = "50%";
    popup.style.visibility = "visible";
}

async function aniAcc() {
    let obj = document.getElementById("accept-reject");
    obj.style.visibility = "visible";
    await sleep(3000);

    let button = document.getElementById("acc");
    await sleep(300);
    button.style.boxShadow = "0 0 10px rgb(70, 144, 255)";
    button.style.backgroundColor = "rgb(0, 160, 0)";
    await sleep(1500);
    button.style.backgroundColor = "";
    button.style.boxShadow = "";
    accept();
    await sleep(5000)
    let popup = document.getElementById("positiv");
    popup.style.visibility = "";
    popup.style.top = "";
    obj.style.visibility = "";

}
async function aniRej() {
    let obj = document.getElementById("accept-reject");
    obj.style.visibility = "visible";
    await sleep(3000);

    let button = document.getElementById("rej");
    await sleep(300);
    button.style.boxShadow = "0 0 10px rgb(70, 144, 255)";
    button.style.backgroundColor = "rgb(255, 59, 59)";
    await sleep(1500);
    button.style.backgroundColor = "";
    button.style.boxShadow = "";
    reject();
    await sleep(5000)
    let popup = document.getElementById("negativ");
    popup.style.visibility = "";
    popup.style.top = "";

    obj.style.visibility = "";
}


let marker = [];

function initSelectSingle() {
    let resluts = document.getElementById("resultList");
    resluts.innerHTML = "<ol><li>Ort a</li><li>Ort b</li><li>Ort c</li><li>Ort d</li></ol>";

    let waypoints = [
        [-74.277018, 40.251148],
        [-74.281740, 40.238832],
        [-74.274578, 40.235468],
        [-74.258365, 40.241114]
    ];

    for (let i = 0; i < waypoints.length; i++) {
        marker.push(new mapboxgl.Marker()
            .setLngLat(waypoints[i])
            .addTo(map));
    }

    let center = [-74.280717, 40.246943];

    map.jumpTo({
        center: center,
        zoom: 12
    });

    document.querySelectorAll("#results > button").forEach(button => {
        console.log(button);

        button.style.visibility = "hidden";
    })

    showResults();
}

let lastSelected = -1;
async function selectSingle(repeat) {

    let randomSelection = -1;
    if (!repeat) {
        do {
            randomSelection = Math.round(Math.random() * 3);
        } while (randomSelection == lastSelected);
        lastSelected = randomSelection;
    } else {
        randomSelection = lastSelected;
    }

    let obj = document.querySelector(`#resultList > * > li:nth-child(${randomSelection+1})`);


    obj.style.backgroundColor = "#c7c7c7";


    await sleep(3000);

    document.querySelectorAll("#resultList > * > li").forEach(li => {
        li.style.fontWeight = "";
        li.style.color = "";
    })

    obj.style.backgroundColor = "";
    obj.style.fontWeight = "bolder";
    obj.style.color = "#525252";
    map.flyTo({
        center: marker[randomSelection].getLngLat(),
        zoom: 14
    });
    await sleep(4000);
}

function stopSelectSingle() {
    for (let i = 0; i < marker.length; i++) {
        marker[i].remove();
    }
    marker = [];
    hideResults();
    resetPosition();

    document.querySelectorAll("#results > button").forEach(button => {
        button.style.visibility = "";
    })

    document.getElementById("resultList").innerHTML = "";
}


let position = 0;

function initPrevNext() {
    let resluts = document.getElementById("resultList");
    resluts.innerHTML = "<ul><li>Ort a</li><li>Ort b</li><li>Ort c</li></ul>";

    // Empire State, WiBRidge, Liberty
    let waypoints = [
        [-73.985632, 40.748473],
        [-73.972016, 40.713601],
        [-74.044539, 40.689398]
    ];


    for (let i = 0; i < waypoints.length; i++) {
        marker.push(new mapboxgl.Marker()
            .setLngLat(waypoints[i])
            .addTo(map));
    }

    map.jumpTo({
        center: waypoints[0],
        zoom: 12
    });

    showResults();
    let obj = document.querySelector("#resultList > * > li:nth-child(1)");
    obj.style.fontWeight = "bolder";
    obj.style.color = "#525252";
}

async function next() {
    const button = document.getElementById("next");
    button.style.backgroundColor = "#ff00bb";
    await sleep(2000);
    button.style.backgroundColor = "";

    let obj = document.querySelector(`#resultList > * > li:nth-child(${position+1})`);
    obj.style.fontWeight = "";
    obj.style.color = "";

    position = (position + 1) % 3;

    obj = document.querySelector(`#resultList > * > li:nth-child(${position+1})`);
    obj.style.fontWeight = "bolder";
    obj.style.color = "#525252";


    map.flyTo({
        center: marker[position].getLngLat(),
        zoom: 12,
        speed: 0.3
    });
}
async function prev() {
    const button = document.getElementById("prev");
    button.style.backgroundColor = "#ff00bb";
    await sleep(2000);
    button.style.backgroundColor = "";

    let obj = document.querySelector(`#resultList > * > li:nth-child(${position+1})`);
    obj.style.fontWeight = "";
    obj.style.color = "";

    position = position - 1 < 0 ? 2 : position - 1;

    obj = document.querySelector(`#resultList > * > li:nth-child(${position+1})`);
    obj.style.fontWeight = "bolder";
    obj.style.color = "#525252";


    map.flyTo({
        center: marker[position].getLngLat(),
        zoom: 12,
        speed: 0.3
    });
}

function stopNextPrev() {
    for (let i = 0; i < marker.length; i++) {
        marker[i].remove();
    }
    marker = [];
    position = 0;
    hideResults();
    resetPosition();
}

/*
MENU NAVIGATION
*/

function hideMenu() {
    // $("#menu").css("left", "-15.5em");
    document.getElementById("menu").style.left = "-15.5em";
}

function showMenu() {
    // $("#menu").css("left", ".75em");
    document.getElementById("menu").style.left = ".75em";

}

function hideResults() {
    // $("#results").css("left", "-15.5em");
    document.getElementById("results").style.left = "-15.5em";

}

function showResults() {
    // $("#results").css("left", ".75em");
    document.getElementById("results").style.left = ".75em";

}

function hideHelp() {
    // $("#help").css("left", "-15.5em");
    document.getElementById("help").style.left = "-15.5em";

}

function showHelp() {
    // $("#help").css("left", ".75em");
    document.getElementById("help").style.left = ".75em";

}

function showSearch() {
    // $("#searchbar").css("top", "1em");
    document.getElementById("searchbar").style.top = "1em";

}

function hideSearch() {
    // $("#searchbar").css("top", "-5em");
    document.getElementById("searchbar").style.top = "-5em";


}

// function selectResult(number) {
//     clearSelection();
//     $(`#resultList li:nth-child(${number})`).css("background-color", "gray");
// }

// function clearSelection() {
//     $("#resultList").children().css("background-color", "unset");
// }

/*
MAP MANIPULATION
*/

function sateliteBasemap() {
    map.setStyle('mapbox://styles/mapbox/satellite-v9');
}

function vectorBasemap() {
    map.setStyle('mapbox://styles/mapbox/streets-v11');
}

async function fakeUserLocation() {
    let center = map.getCenter();
    let zoom = map.getZoom();
    let coordinates = [-75, 40];
    let point = {
        "type": "Point",
        "coordinates": coordinates
    };
    map.addSource('point', {
        'type': 'geojson',
        'data': point
    });


    map.addLayer({
        'id': 'circle',
        'source': 'point',
        'type': 'circle',
        'paint': {
            'circle-radius': 10,
            'circle-color': '#0070bf'
        }
    });

    var popup = new mapboxgl.Popup({
            closeOnClick: false
        })
        .setLngLat(coordinates)
        .setHTML('<p>Hier bin ich<p>')
        .addTo(map);

    map.flyTo({
        center: coordinates,
        zoom: 14
    })

    await sleep(7000);
    map.removeLayer("circle");
    map.removeSource("point");
    popup.remove();
    map.jumpTo({
        center: center,
        zoom: zoom
    });

}


var markers = [];

function addMarker() {
    let center = map.getCenter();
    var marker = new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(map);
    markers.push(marker);
}

function clearMarker() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].remove();
    }
    markers = [];
}


var geojson = {
    'type': 'FeatureCollection',
    'features': []
};

// Used to draw a line between points
var linestring = {
    'type': 'Feature',
    'geometry': {
        'type': 'LineString',
        'coordinates': []
    }
};

/**
 * @see https://docs.mapbox.com/mapbox-gl-js/example/measure/
 */
function setPoint() {
    try {
        let center = map.getCenter();
        var point = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [center.lng, center.lat]
            },
            'properties': {
                'id': String(new Date().getTime())
            }
        };

        if (geojson.features.length > 1) geojson.features.pop();
        distanceContainer.innerHTML = '';

        geojson.features.push(point);


        if (geojson.features.length > 1) {
            linestring.geometry.coordinates = geojson.features.map(function (
                point
            ) {
                return point.geometry.coordinates;
            });

            geojson.features.push(linestring);

            // Populate the distanceContainer with total distance
            var value = document.createElement('pre');
            value.textContent =
                'Total distance: ' +
                turf.length(linestring).toLocaleString() +
                'km';
            distanceContainer.appendChild(value);
        }

        console.log(geojson);


        map.getSource('geojson').setData(geojson);
    } catch (e) {
        geojson = {
            'type': 'FeatureCollection',
            'features': []
        };

        linestring = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        };
    }
}

function activateDistanceMeasurements() {
    map.addSource('geojson', {
        'type': 'geojson',
        'data': geojson
    });

    // Add styles to the map
    map.addLayer({
        id: 'measure-points',
        type: 'circle',
        source: 'geojson',
        paint: {
            'circle-radius': 5,
            'circle-color': '#000'
        },
        filter: ['in', '$type', 'Point']
    });
    map.addLayer({
        id: 'measure-lines',
        type: 'line',
        source: 'geojson',
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        },
        paint: {
            'line-color': '#000',
            'line-width': 2.5
        },
        filter: ['in', '$type', 'LineString']
    });

}

function deactivateDistanceMeasurements() {
    map.removeLayer("measure-points");
    map.removeLayer("measure-lines");
    map.removeSource("geojson");
    geojson = {
        'type': 'FeatureCollection',
        'features': []
    }
    linestring = {
        'type': 'Feature',
        'geometry': {
            'type': 'LineString',
            'coordinates': []
        }
    }
    distanceContainer.innerHTML = "";
}

/*
MAP NAVIGATION
*/

function rotate(bearing) {
    let curBearing = map.getBearing();
    map.rotateTo(curBearing + bearing);
}

function pitch(pitch) {
    map.easeTo({
        pitch: pitch
    });
}

function resetView() {
    map.resetNorthPitch({
        duration: ANIMATION_DURATION
    });
}

function up() {
    let bounds = map.getBounds();
    let newCenter = new mapboxgl.LngLat(bounds.getCenter().lng, bounds.getNorth());

    map.panTo(newCenter, {
        duration: ANIMATION_DURATION
    });
}

function down() {
    let bounds = map.getBounds();
    let newCenter = new mapboxgl.LngLat(bounds.getCenter().lng, bounds.getSouth());

    map.panTo(newCenter, {
        duration: ANIMATION_DURATION
    });
}

function left() {
    let bounds = map.getBounds();
    let newCenter = new mapboxgl.LngLat(bounds.getWest(), bounds.getCenter().lat);

    map.panTo(newCenter, {
        duration: ANIMATION_DURATION
    });
}

function right() {
    let bounds = map.getBounds();
    let newCenter = new mapboxgl.LngLat(bounds.getEast(), bounds.getCenter().lat);

    map.panTo(newCenter, {
        duration: ANIMATION_DURATION
    });
}

function upRight() {
    let bounds = map.getBounds();
    map.panTo(bounds.getNorthEast(), {
        duration: ANIMATION_DURATION
    })
}

function upLeft() {
    let bounds = map.getBounds();
    map.panTo(bounds.getNorthWest(), {
        duration: ANIMATION_DURATION
    })
}

function downRight() {
    let bounds = map.getBounds();
    map.panTo(bounds.getSouthEast(), {
        duration: ANIMATION_DURATION
    })
}

function downLeft() {
    let bounds = map.getBounds();
    map.panTo(bounds.getSouthWest(), {
        duration: ANIMATION_DURATION
    })
}

function zoomIn() {
    map.zoomIn({
        duration: ANIMATION_DURATION
    })
}

function zoomOut() {
    map.zoomOut({
        duration: ANIMATION_DURATION
    })
}