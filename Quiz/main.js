// Preprocessing:
// Zapisuje przykładowy quiz w formacie JSON w localstorage.
var example = [{ "task": "2 + 2 * 2 = ", "solution": 6, "penalty": 7 },
    { "task": "3 - (-6 : 2) = ", "solution": 6, "penalty": 15 },
    { "task": "14 - 4 + 6 * 2 - 91 : 13 = ", "solution": 15, "penalty": 50 },
    { "task": "4 * 6 : 8 + 10 = ", "solution": 13, "penalty": 25 },
    { "task": "12 + (111 - 8 * 7) = ", "solution": 67, "penalty": 30 }
];
localStorage.setItem("quiz", JSON.stringify(example));
/* Odczytuje quiz z local storage
 * i zapisuje informacje o nim w zmiennych lokalnych.
 */
var texts = [];
var correct = [];
var penalties = [];
var quiz = JSON.parse(localStorage.getItem("quiz"));
for (var i = 0; i < quiz.length; ++i) {
    texts.push(quiz[i]["task"]);
    correct.push(quiz[i]["solution"]);
    penalties.push(quiz[i]["penalty"]);
}
var size = quiz.length;
// Ustawia zmienne globalbe opisujące przebieg rozwiązywania quizu.
var answers = new Array(size); //odpowiedzi użytkownika na każde z pytań
var page = 0; //aktualnie wyświetlane pytanie (indeksowane od 0)
var total = 0; //całkowity czas rozwiązywanie quizu
var penTotal = 0; //suma kar dla aktualnego rozwiązania
var lastEnter = []; //czasy ostatnich wyświetleń pytań (s)
var taskTimes = []; //sumy czasów wyświetlania pytań (s)
for (var i = 0; i < size; i++) {
    lastEnter.push(0);
    taskTimes.push(0);
}
var secs = 0; //sekundy od rozpoczęcia quizu
var timer = null; //będzie przechowywć ID interwału z czasomierzem
// Tworzymy pustą tablicę wyników w localstorage, o ile jeszcze nie istnieje.
if (!notEmpty(localStorage.getItem("results"))) {
    var res = [];
    localStorage.setItem("results", JSON.stringify(res));
}
// Funkcje:
// Sprawdza, czy argument nie jest NULLem bądź pustym słowem.
function notEmpty(element) {
    if (element === undefined || element === null || element === "") {
        return false;
    }
    return true;
}
function arrayNotEmpty(array) {
    var empty = false;
    for (var i = 0; i < array.length && !empty; i++) {
        if (!notEmpty(array[i])) {
            empty = true;
        }
    }
    return empty;
}
// Zamienia czas podany w sekundach na napis go reprezentujący (np. 64 -> 1:04)
function secondsToString(time) {
    var mins = Math.floor(time / 60).toString();
    var secs = (time % 60).toString();
    var result = mins + ":";
    if (parseInt(secs) < 10) {
        result += "0";
    }
    result += secs;
    return result;
}
// Rozpoczęcie nowego podejścia do quizu.
function start() {
    // Wyświetlamy treść 1. zadania i puste pole "input".
    document.getElementById("quiz").style.display = "inline";
    document.getElementById("start").style.display = "none";
    document.getElementById("main").style.display = "none";
    document.getElementById("text").innerHTML = (texts[0] + "?").fontsize(6);
    document.getElementById("number").innerHTML = "Zadanie 1";
    document.getElementById("penalty").innerHTML = "kara za błąd: " +
        penalties[0].toString() + " sekund";
    var input = (document.getElementById("input"));
    var actVal = answers[page];
    input.value = "";
    // Blokujemy przycisk "Poprzednie", odblokowujemy "Następne".
    var n = document.getElementsByClassName("scroll")[1];
    var p = document.getElementsByClassName("scroll")[0];
    n.disabled = false;
    p.disabled = true;
    // Ustawiamy czas wyświetlenia 1.zadania.
    lastEnter[0] = 0;
    // Puszczamy czasomierz.
    timer = setInterval(function () {
        secs += 1;
        document.getElementById("timer").innerHTML = secondsToString(secs);
    }, 1000);
}
// Działanie przycisku "Następne".
function next() {
    /* Notujemy czas opuszczenia poprzedniego zadania,
     * dodajemy do sumy czasu spędzonego nad tym zadaniem.
     */
    var act = secs;
    taskTimes[page] += (act - lastEnter[page]);
    // Przełączamy zmienną page i ustawiamy czas wyświetlenia nowego zadania.
    page += 1;
    lastEnter[page] = act;
    /* Wyświetlamy nr, treść i karę odpowiednią dla aktualnego zadania.
     * W polu "input" wyświetlamy aktualnie zapisaną odpowiedź użytkownika
     * na dane zadanie, o ile została już udzielona.
     */
    document.getElementById("text").innerHTML = (texts[page] + "?").fontsize(6);
    document.getElementById("number").innerHTML = "Zadanie " +
        (page + 1).toString();
    document.getElementById("penalty").innerHTML = "kara za błąd: " +
        penalties[page].toString() + " sekund";
    var input = (document.getElementById("input"));
    var actVal = answers[page];
    if (notEmpty(actVal)) {
        input.value = actVal;
    }
    else {
        input.value = "";
    }
    // Blokujemy przycisk "Następne, jeśli to konieczne.
    var n = document.getElementsByClassName("scroll")[1];
    var p = document.getElementsByClassName("scroll")[0];
    p.disabled = false;
    if (page === size - 1) {
        n.disabled = true;
    }
}
// Działanie przycisku "Poprzednie", analogicznie jak "Następne".
function previous() {
    var act = secs;
    taskTimes[page] += act - lastEnter[page];
    page -= 1;
    lastEnter[page] = act;
    document.getElementById("text").innerHTML = (texts[page] + "?").fontsize(6);
    document.getElementById("number").innerHTML = "Zadanie " +
        (page + 1).toString();
    document.getElementById("penalty").innerHTML = "kara za błąd: " +
        penalties[page].toString() + " sekund";
    var input = (document.getElementById("input"));
    var actVal = answers[page];
    if (notEmpty(actVal)) {
        input.value = actVal;
    }
    else {
        input.value = "";
    }
    var n = document.getElementsByClassName("scroll")[1];
    var p = document.getElementsByClassName("scroll")[0];
    n.disabled = false;
    if (page === 0) {
        p.disabled = true;
    }
}
/* Pobiera odpowiedź z wejścia i zapisuje ją
 * pod odpowiednim indeksem tablicy "answers".
 */
function takeAnswer() {
    var element = (document.getElementById("input"));
    var a = element.value;
    answers[page] = a;
}
/* Zapisuje aktulnie edytowaną odpowiedź i sprawdza,
 * czy udzielono odpowiedzi na wszystkie pytania.
 * Jeśli tak, odblokowuje przycisk "Stop".
 * Wywoływana przy każdym kontakcie z polem wejścia (oninput).
 */
function checkIfCompleted() {
    takeAnswer();
    var button = document.getElementById("stop");
    if (!arrayNotEmpty(answers)) {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}
/* Sprawdza, czy nowo uzyskany rezultat znajdzie się w top 3,
 * jeśli tak, edytuję najlepszą trójkę.
 */
function isTopResult(time) {
    var b1 = null;
    if (notEmpty(localStorage.getItem("best1"))) {
        b1 = parseInt(localStorage.getItem("best1"));
    }
    var b2 = null;
    if (notEmpty(localStorage.getItem("best2"))) {
        b2 = parseInt(localStorage.getItem("best2"));
    }
    var b3 = null;
    if (notEmpty(localStorage.getItem("best3"))) {
        b3 = parseInt(localStorage.getItem("best3"));
    }
    if (!notEmpty(b1) || b1 > time) {
        localStorage.setItem("best1", time.toString());
        if (notEmpty(b1)) {
            localStorage.setItem("best2", b1.toString());
        }
        if (notEmpty(b2)) {
            localStorage.setItem("best3", b2.toString());
        }
    }
    else if (!notEmpty(b2) || b2 > time) {
        localStorage.setItem("best2", time.toString());
        if (notEmpty(b2)) {
            localStorage.setItem("best3", b2.toString());
        }
    }
    else if (!notEmpty(b3) || b3 > time) {
        localStorage.setItem("best3", time.toString());
    }
}
/* Zapisuje tylko wynik (struktura result z wypełnionym
 * jedynie polem total) w localstorage.
  */
function saveResultOnly(time) {
    isTopResult(time);
    var res = { date: null, times: null, penalties: null, total: time };
    var list = JSON.parse(localStorage.getItem("results"));
    list.push(res);
    localStorage.setItem("results", JSON.stringify(list));
}
// Zapisuje wynik i statystyki w localstorage.
function saveResultAndStats(taskTimes, penTime, time) {
    isTopResult(time);
    var res = { date: new Date().toString(), times: taskTimes, penalties: penTime, total: time };
    var list = JSON.parse(localStorage.getItem("results"));
    list.push(res);
    localStorage.setItem("results", JSON.stringify(list));
}
/* Tworzy i zwraca paragraf tekstowy.
 * Wykorzystywana przy tworzeniu tekstów opisujących wynik podejścia.
 */
function finalPara(text) {
    var t1 = document.createElement('p');
    t1.style.fontSize = "20px";
    var con1 = document.createTextNode(text);
    t1.appendChild(con1);
    return t1;
}
/* Tworzy i zwraca przycisk o określonym stylu, z danym tekstem.
 * Wykorzystywana przy tworzeniu przycisków końcowych.
 */
function finalButton(text) {
    var button = document.createElement('button');
    button.type = "button";
    button.innerHTML = text;
    button.style.backgroundColor = "deepskyblue";
    button.style.borderColor = "crimson";
    button.style.margin = "25px";
    return button;
}
// Wraca do strony głównej
function back() {
    location.href = "./index.html";
}
// Zakończenie quizu przyciskiem "Stop".
function finish() {
    //Wyłączamy czasomierz.
    clearInterval(timer);
    // Notujemy czas zakończenia przeglądania ostatniego zadania.
    // Liczymy całkowity czas rozwiązywania (suma czasów ze wszystkich zadań)
    var endTime = secs;
    taskTimes[page] += endTime - lastEnter[page];
    for (var i = 0; i < size; ++i) {
        total += taskTimes[i];
    }
    // Ukrywamy kontener z quizem, uzupełniamy i wyświetlamy ten z wynikami.
    var quiz = document.getElementById("quiz");
    quiz.style.display = "none";
    var results = document.getElementById("results");
    var newHeader = document.createElement('header');
    var newText = document.createTextNode('Wyniki');
    newHeader.appendChild(newText);
    results.appendChild(newHeader);
    /* W pętli sprawdzamy poprawność wyników i naliczamy karne sekundy.
     * Zadania zrobione dobrze wyświetlamy na zielono, źle na czerwono,
     * z podaniem poprawnej i błędenj odpowiedzi.
     */
    for (var i = 0; i < size; ++i) {
        var newPara = document.createElement('p');
        newPara.style.fontSize = "25px";
        var solution = texts[i] + correct[i];
        if (answers[i] == correct[i]) {
            newPara.style.color = "green";
        }
        else {
            penTotal += penalties[i];
            solution += (" (błędna odpowiedź: " + answers[i] + ")");
            newPara.style.color = "red";
        }
        var s = document.createTextNode(solution);
        newPara.appendChild(s);
        results.appendChild(newPara);
    }
    /* Wypisujemy wynik podejścia, z podziałem na czas rozwiązywania
     * i sekundy karne.
     */
    var t1 = finalPara('Czas rozwiązywania: ' + secondsToString(total));
    var t2 = finalPara('Kary łącznie: ' + secondsToString(penTotal));
    var t3 = finalPara('Rezultat: ' + secondsToString(total + penTotal));
    t3.style.fontSize = "30px";
    t3.style.fontWeight = "400";
    t3.style.color = "blue";
    results.appendChild(t1);
    results.appendChild(t2);
    results.appendChild(t3);
    // Dodajemy przyciski końcowe.
    var saveWith = finalButton('Zapisz wynik ze statystykami');
    saveWith.onclick = function () {
        saveResultAndStats(taskTimes, penTotal, total + penTotal);
        window.location.reload();
    };
    results.appendChild(saveWith);
    var saveWithout = finalButton('Zapisz wynik');
    saveWithout.onclick = function () {
        saveResultOnly(total + penTotal);
        window.location.reload();
    };
    results.appendChild(saveWithout);
}
