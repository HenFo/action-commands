/**
 * sets js to sleep
 * function that uses sleep must be declared async
 * @param {Number} milliseconds
 * @see https://www.sitepoint.com/delay-sleep-pause-wait/
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

document.getElementById("not_random").addEventListener("change", function () {
    toGo.push(state);
    done = [];
    prevState = -1;
    state = 0;
});

document.getElementById("random").addEventListener("change", function () {
    getNextState(true);
});

let randomButton = document.getElementById("random");
let notRandomButton = document.getElementById("not_random");

let animateButton = document.getElementById("animateMap");
let repeatButton = document.getElementById("repeatMap");
repeatButton.disabled = "disabled";

let prevState = -1;
let toGo = [0, 1, 2, 3, 4, 5, 6, 7, 10, 12, 14, 16, 18, 19, 21, 22, 24, 25, 26];
let done = [];

function getNextState(random) {
    try {
        if (random && randomButton.checked) {
            let randomInt = Math.round(Math.random() * (toGo.length - 1));
            let nState = toGo.splice(randomInt, 1)[0];
            prevState = state;
            state = nState;
            done.push(state);
        } else {
            prevState = state++;
            done.push(state);
        }
    } catch {
        state = -1;
    }
}

/* 
0/1 = basic direction; 2/3 = combined direction
*/
var state = -1;
getNextState(true);
var used = -1;
let repeat = false;
async function animateMap() {
    randomButton.disabled = "disabled";
    notRandomButton.disabled = "disabled";

    console.log(state);

    animateButton.disabled = "disabled";
    repeatButton.disabled = "disabled";
    if (prevState == 23) {
        stopNextPrev();
        await sleep(4000);
    }

    switch (state) {
        case 0:
        case 1: {
            let selec = -1;
            if (!repeat) {
                do {
                    selec = Math.round(Math.random() * 3);
                } while (selec == used)
            } else {
                selec = used;
            }
            used = selec;
            switch (selec) {
                case 0:
                    up();
                    await sleep(4000);
                    resetPosition();
                    break;
                case 1:
                    right();
                    await sleep(4000);
                    resetPosition();
                    break;
                case 2:
                    down();
                    await sleep(4000);
                    resetPosition();
                    break;
                case 3:
                    left();
                    await sleep(4000);
                    resetPosition();
                    break;
                default:
                    break;
            }
            getNextState(true);
            break;
        }

        case 2:
        case 3: {
            let selec = -1;
            if (!repeat) {
                do {
                    selec = Math.round(Math.random() * 3 + 4);
                } while (selec == used)
            } else {
                selec = used;
            }
            used = selec;
            switch (selec) {
                case 4:
                    upRight();
                    await sleep(4000);
                    resetPosition();
                    break;
                case 5:
                    downRight();
                    await sleep(4000);
                    resetPosition();
                    break;
                case 6:
                    downLeft();
                    await sleep(4000);
                    resetPosition();
                    break;
                case 7:
                    downLeft();
                    await sleep(4000);
                    resetPosition();
                    break;
                default:
                    break;
            }
            getNextState(true);
            break;
        }

        case 4: {
            zoomIn();
            await sleep(4000);
            resetPosition();
            getNextState(true);
            break;
        }

        case 5: {
            zoomOut();
            await sleep(4000);
            resetPosition();
            getNextState(true);
            break;
        }

        case 6: {
            rotate(45);
            await sleep(4000);
            resetPosition();
            getNextState(true);
            break;
        }
        case 7: {
            rotate(90);
            getNextState(false);
            break;
        }
        case 8: {
            pitch(45);
            getNextState(false);
            break;
        }
        case 9: {
            resetView();
            getNextState(true);
            break;
        }

        // Ansicht zurück auf Startposition
        case 10: {
            resetPosition();
            await sleep(4000);
            addMarker();
            await sleep(2000)
            map.panTo([-74.3, 40.1])
            await sleep(2000);
            addMarker();
            await sleep(2000);
            map.panTo([-74.7, 40.15])
            await sleep(2000);
            addMarker();
            getNextState(false);
            break;
        }
        case 11: {
            clearMarker();
            getNextState(true);
            break;
        }
        case 12: {
            showMenu();
            getNextState(false);
            break;
        }
        case 13: {
            hideMenu();
            getNextState(true);
            break;
        }
        case 14: {
            showHelp();
            getNextState(false);
            break;
        }
        case 15: {
            hideHelp();
            getNextState(true);
            break;
        }
        case 16: {
            showSearch();
            getNextState(false);
            break;
        }
        case 17: {
            hideSearch();
            getNextState(true);
            break;
        }
        case 18: {
            await fakeUserLocation();
            getNextState(true);
            break;
        }
        case 19: {
            sateliteBasemap();
            getNextState(false);
            break;
        }
        case 20: {
            vectorBasemap();
            getNextState(true);
            break;
        }
        //auf Startansicht reseten
        case 21: {
            resetPosition();
            await sleep(3000);
            activateDistanceMeasurements();
            setPoint();
            await sleep(2000);
            map.panTo([-74.7, 40.15]);
            await sleep(2000);
            setPoint();
            await sleep(2000);
            map.panTo([-74.3, 40.1]);
            await sleep(2000);
            setPoint();
            await sleep(5000);
            deactivateDistanceMeasurements();
            getNextState(true);
            break;
        }

        case 22: {
            initPrevNext();
            await sleep(5000);
            next();
            await sleep(5000);
            next();
            await sleep(5000);
            getNextState(false);
            break;
        }

        case 23: {
            prev();
            await sleep(5000);
            prev();
            await sleep(5000);
            getNextState(true);
            break;
        }

        case 24: {
            await aniAcc();
            getNextState(true);
            break;
        }
        case 25: {
            await aniRej();
            getNextState(true);
            break;
        }

        case 26: {
            initSelectSingle();
            await sleep(3000);
            await selectSingle(repeat);
            await sleep(5000);
            stopSelectSingle();
            getNextState(true);
            break;
        }

        //////////////////
        default:
            state = -1;
            prevState = -1;
            resetPosition();
            download(done, "Reihenfolge.txt", "text/plain;charset=utf-8");
            break;

    }
    animateButton.disabled = "";
    repeatButton.disabled = "";

}

async function repeatMap() {
    animateButton.disabled = "disabled";
    repeatButton.disabled = "disabled";
    switch (prevState) {
        case 0:
        case 1:
        case 2:
        case 3: {
            repeat = true;
            break;
        }

        case 7: {
            resetPosition();
            await sleep(3000);
            break;
        }
        case 8: {
            map.jumpTo({
                pitch: 0,
                bearing: 90
            });
            await sleep(3000);
            break;
        }
        case 9: {
            map.jumpTo({
                pitch: 45,
                bearing: 90
            });
            await sleep(3000);
            break;
        }
        case 10: {
            resetPosition();
            clearMarker();
            await sleep(3000);
            break;
        }
        case 11: {
            let pos = [
                [-74.5, 40],
                [-74.3, 40.1],
                [-74.7, 40.15]
            ];
            for (let i = 0; i < pos.length; i++) {
                let marker = new mapboxgl.Marker()
                    .setLngLat(pos[i])
                    .addTo(map);
                markers.push(marker);
            }
            await sleep(1000);
            break;
        }
        case 19: {
            vectorBasemap();
            await sleep(5000);
            break;
        }
        case 20: {
            sateliteBasemap();
            await sleep(5000);
            break;
        }
        case 22: {
            let objs = document.querySelectorAll("#resultList > li");
            objs.forEach(li => {
                li.style.fontWeight = "";
                li.style.color = "";
            });
            stopNextPrev();
            break;
        }
        case 23: {
            stopNextPrev();
            initPrevNext();
            position = 2;
            let obj = document.querySelector(`#resultList > li:nth-child(${1})`);
            obj.style.fontWeight = "";
            obj.style.color = "";

            obj = document.querySelector(`#resultList > li:nth-child(${position+1})`);
            obj.style.fontWeight = "bolder";
            obj.style.color = "#525252";

            map.jumpTo({
                center: marker[position].getLngLat(),
                zoom: 12,
            });
            await sleep(3000);
            break;
        }
        case 12: {
            let menu = document.getElementById("menu");
            menu.style.transitionDuration = "0s";
            hideMenu();
            await sleep(500);
            menu.style.transitionDuration = "";
            await sleep(3000);
            break;
        }
        case 13: {
            let menu = document.getElementById("menu");
            menu.style.transitionDuration = "0s";
            showMenu();
            await sleep(500);
            menu.style.transitionDuration = "";
            await sleep(3000);
            break;
        }
        case 14: {
            let menu = document.getElementById("help");
            menu.style.transitionDuration = "0s";
            hideHelp();
            await sleep(500);
            menu.style.transitionDuration = "";
            await sleep(3000);
            break;
        }
        case 15: {
            let menu = document.getElementById("help");
            menu.style.transitionDuration = "0s";
            showHelp();
            await sleep(500);
            menu.style.transitionDuration = "";
            await sleep(3000);
            break;
        }
        case 16: {
            let menu = document.getElementById("searchbar");
            menu.style.transitionDuration = "0s";
            hideSearch();
            await sleep(500);
            menu.style.transitionDuration = "";
            await sleep(3000);
            break;
        }
        case 17: {
            let menu = document.getElementById("searchbar");
            menu.style.transitionDuration = "0s";
            showSearch();
            await sleep(500);
            menu.style.transitionDuration = "";
            await sleep(3000);
            break;
        }


        default:
            break;
    }
    if (![8, 11, 13, 15, 17, 20, 23].includes(state)) {
        toGo.push(done.splice(-1,1)[0]);
    } else {
        done.splice(-1,1);
    }
    state = prevState;
    animateMap();
    repeat = false;
}