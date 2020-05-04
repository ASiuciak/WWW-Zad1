// Sprawdza, czy argument nie jest NULLem bądź pustym słowem.
function notEmpty(element) {
    if (element === undefined || element === null || element === "") {
        return false;
    }
    return true;
}

// Zamienia czas podany w sekundach na napis go reprezentujący (np. 64 -> 1:04)
function secondsToString(time) {
    let mins = Math.floor(time / 60).toString();
    let secs = (time % 60).toString();
    let result = mins + ":";
    if (parseInt(secs) < 10) {
        result += "0";
    }
    result += secs;
    return result;
}

// Resetuje najlepsze wyniki
function reset() {
    localStorage.removeItem("best1");
    localStorage.removeItem("best2");
    localStorage.removeItem("best3");
    window.location.reload();
}

// Wyświetla statystyki wszystkich podejść na konsoli
function showResults() {
    console.log(localStorage.getItem("results"));
}

// Aktualizuje listę najlepszych wyników.
function updateList() {
    let b1 = localStorage.getItem("best1");
    let b2 = localStorage.getItem("best2");
    let b3 = localStorage.getItem("best3");
    if (notEmpty(b1)) {
        document.getElementById("best1").innerHTML =
        secondsToString(parseInt(b1));
    }
    if (notEmpty(b2)) {
        document.getElementById("best2").innerHTML =
        secondsToString(parseInt(b2));
    }
    if (notEmpty(b3)) {
        document.getElementById("best3").innerHTML =
        secondsToString(parseInt(b3));
    }
}

updateList();