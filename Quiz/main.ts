// Preprocessing:

// Zapisuje przykładowy quiz w formacie JSON w localstorage.
let example = [{"task": "2 + 2 * 2 = ", "solution": 6, "penalty": 7},
               {"task": "3 - (-6 : 2) = ", "solution": 6, "penalty": 15},
               {"task": "14 - 4 + 6 * 2 - 91 : 13 = ", "solution": 15, "penalty": 50},
               {"task": "4 * 6 : 8 + 10 = ", "solution": 13, "penalty": 25}];
localStorage.setItem("quiz", JSON.stringify(example));

/* Odczytuje 4 - zadaniowy quiz z local storage
 * i zapisuje informacje o nim w zmiennych lokalnych.
 */
let texts : string[] = ["", "", "", ""];
let correct : number[] = [0, 0, 0, 0];
let penalties : number[] = [0, 0, 0, 0];
let quiz = JSON.parse(localStorage.getItem("quiz"));
for (var i = 0; i < 4; ++i) {
    texts[i] = quiz[i]["task"];
    correct[i] = quiz[i]["solution"];
    penalties[i] = quiz[i]["penalty"];
}

// Ustawia zmienne globalbe opisujące przebieg rozwiązywania quizu.
let answers = new Array(); //odpowiedzi użytkownika na każde z 4 pytań
let page = 0; //aktualnie wyświetlane pytanie (indeksowane od 0)
let total = 0; //całkowity czas rozwiązywanie quizu
let penTotal = 0; //suma kar dla aktualnego rozwiązania
let lastEnter : number[] = [0, 0, 0, 0]; //czasy ostatnich wyświetleń pytań (s)
let taskTimes : number[] = [0, 0, 0, 0]; //sumy czasów wyświetlania pytań (s)
let secs = 0; //sekundy od rozpoczęcia quizu
let timer = null; //będzie przechowywć ID interwału z czasomierzem

// Tworzymy pustą tablicę wyników w localstorage, o ile jeszcze nie istnieje.
if (!notEmpty(localStorage.getItem("results"))) {
    let res = [];
    localStorage.setItem("results", JSON.stringify(res));
}


// Struktury:

// Struktura reprezentująca statystyki 1 podejścia do quizu.
interface result{
    date: string;
    time1: number;
    time2: number;
    time3: number;
    time4: number;
    penalties: number;
    total: number;
}


// Funkcje:

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
    let input = <HTMLInputElement>(document.getElementById("input"));
    let actVal = answers[page];
    input.value = "";

    // Blokujemy przycisk "Poprzednie", odblokowujemy "Następne".
    let n = <HTMLInputElement> document.getElementsByClassName("scroll")[1];
    let p = <HTMLInputElement> document.getElementsByClassName("scroll")[0];
    n.disabled = false;
    p.disabled = true;

    // Ustawiamy czas wyświetlenia 1.zadania.
    lastEnter[0] = 0;

    // Puszczamy czasomierz.
    timer = setInterval(() => {
        secs += 1;
        document.getElementById("timer").innerHTML = secondsToString(secs);
      }, 1000);
}

// Działanie przycisku "Następne".
function next() {
    /* Notujemy czas opuszczenia poprzedniego zadania,
     * dodajemy do sumy czasu spędzonego nad tym zadaniem.
     */
    let act = secs;
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
    let input = <HTMLInputElement>(document.getElementById("input"));
    let actVal = answers[page];
    if (notEmpty(actVal)) {
        input.value = actVal;
    } else {
        input.value = "";
    }

    // Blokujemy przycisk "Następne, jeśli to konieczne.
    let n = <HTMLInputElement> document.getElementsByClassName("scroll")[1];
    let p = <HTMLInputElement> document.getElementsByClassName("scroll")[0];
    p.disabled = false;
    if (page === 3) {
        n.disabled = true;
    }
}

// Działanie przycisku "Poprzednie", analogicznie jak "Następne".
function previous() {
    let act = secs;
    taskTimes[page] += act - lastEnter[page];
    page -= 1;
    lastEnter[page] = act;
    document.getElementById("text").innerHTML = (texts[page] + "?").fontsize(6);
    document.getElementById("number").innerHTML = "Zadanie " +
                             (page + 1).toString();
    document.getElementById("penalty").innerHTML = "kara za błąd: " +
                            penalties[page].toString() + " sekund";
    let input = <HTMLInputElement>(document.getElementById("input"));
    let actVal = answers[page];
    if (notEmpty(actVal)) {
        input.value = actVal;
    } else {
        input.value = "";
    }
    let n = <HTMLInputElement> document.getElementsByClassName("scroll")[1];
    let p = <HTMLInputElement> document.getElementsByClassName("scroll")[0];
    n.disabled = false;
    if (page === 0) {
        p.disabled = true;
    }
}

/* Pobiera odpowiedź z wejścia i zapisuje ją
 * pod odpowiednim indeksem tablicy "answers".
 */
function takeAnswer() {
    let element = <HTMLInputElement>(document.getElementById("input"));
    let a = element.value;
    answers[page] = a;
}

/* Zapisuje aktulnie edytowaną odpowiedź i sprawdza,
 * czy udzielono odpowiedzi na wszystkie pytania.
 * Jeśli tak, odblokowuje przycisk "Stop".
 * Wywoływana przy każdym kontakcie z polem wejścia (oninput).
 */
function checkIfCompleted() {
    takeAnswer();
    let button = <HTMLInputElement> document.getElementById("stop");
    if (notEmpty(answers[0]) && notEmpty(answers[1]) &&
       notEmpty(answers[2]) && notEmpty(answers[3])) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }
}

/* Sprawdza, czy nowo uzyskany rezultat znajdzie się w top 3,
 * jeśli tak, edytuję najlepszą trójkę.
 */
function isTopResult(time) {
    let b1 = null;
    if (notEmpty(localStorage.getItem("best1"))) {
        b1 = parseInt(localStorage.getItem("best1"));
    }
    let b2 = null;
    if (notEmpty(localStorage.getItem("best2"))) {
        b2 = parseInt(localStorage.getItem("best2"));
    }
    let b3 = null;
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
    } else if(!notEmpty(b2) || b2 > time) {
        localStorage.setItem("best2", time.toString());
        if (notEmpty(b2)) {
            localStorage.setItem("best3", b2.toString());
        }
    } else if (!notEmpty(b3) || b3 > time) {
        localStorage.setItem("best3", time.toString());
    }
}

/* Zapisuje tylko wynik (struktura result z wypełnionym
 * jedynie polem total) w localstorage.
  */
function saveResultOnly(time) {
    isTopResult(time);
    let res : result = {date: null, time1: null, time2: null, time3: null,
                       time4: null, penalties: null, total: time};
    let list = JSON.parse(localStorage.getItem("results"));
    list.push(res);
    localStorage.setItem("results", JSON.stringify(list));
}

// Zapisuje wynik i statystyki w localstorage.
function saveResultAndStats(taskTimes, penTime, time) {
    isTopResult(time);
    let res : result = {date: new Date().toString(), time1: taskTimes[0],
                       time2: taskTimes[1], time3: taskTimes[2],
                       time4: taskTimes[3], penalties: penTime, total: time};
    let list = JSON.parse(localStorage.getItem("results"));
    list.push(res);
    localStorage.setItem("results", JSON.stringify(list));
}

/* Tworzy i zwraca paragraf tekstowy.
 * Wykorzystywana przy tworzeniu tekstów opisujących wynik podejścia.
 */
function finalPara(text) {
    let t1 = document.createElement('p');
    t1.style.fontSize = "20px";
    let con1 = document.createTextNode(text);
    t1.appendChild(con1);
    return t1;
}

/* Tworzy i zwraca przycisk o określonym stylu, z danym tekstem.
 * Wykorzystywana przy tworzeniu przycisków końcowych.
 */
function finalButton(text) {
    let button = document.createElement('button');
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
    let endTime = secs;
    taskTimes[page] += endTime - lastEnter[page];
    for (var i = 0; i < 4; ++i) {
        total += taskTimes[i];
    }

    // Ukrywamy kontener z quizem, uzupełniamy i wyświetlamy ten z wynikami.
    let quiz = <HTMLInputElement> document.getElementById("quiz");
    quiz.style.display = "none";
    let results = <HTMLInputElement> document.getElementById("results");
    let newHeader = document.createElement('header');
    let newText = document.createTextNode('Wyniki');
    newHeader.appendChild(newText);
    results.appendChild(newHeader);

    /* W pętli sprawdzamy poprawność wyników i naliczamy karne sekundy.
     * Zadania zrobione dobrze wyświetlamy na zielono, źle na czerwono,
     * z podaniem poprawnej i błędenj odpowiedzi.
     */
    for (var i = 0; i < 4; ++i) {
        let newPara = document.createElement('p');
        newPara.style.fontSize = "25px";
        let solution = texts[i] + correct[i];
        if (answers[i] == correct[i]) {
            newPara.style.color = "green";
        } else {
            penTotal += penalties[i];
            solution += (" (błędna odpowiedź: " + answers[i] + ")");
            newPara.style.color = "red";
        }
        let s = document.createTextNode(solution);
        newPara.appendChild(s);
        results.appendChild(newPara);
    }

    /* Wypisujemy wynik podejścia, z podziałem na czas rozwiązywania
     * i sekundy karne.
     */
    let t1 = finalPara('Czas rozwiązywania: ' + secondsToString(total));
    let t2 = finalPara('Kary łącznie: '  + secondsToString(penTotal));
    let t3 = finalPara('Rezultat: ' + secondsToString(total + penTotal));
    t3.style.fontSize = "30px";
    t3.style.fontWeight = "400";
    t3.style.color = "blue";
    results.appendChild(t1);
    results.appendChild(t2);
    results.appendChild(t3);


    // Dodajemy przyciski końcowe.
    let saveWith = finalButton('Zapisz wynik ze statystykami');
    saveWith.onclick = function() {
        saveResultAndStats(taskTimes, penTotal, total + penTotal);
        window.location.reload();
    }
    results.appendChild(saveWith);

    let saveWithout = finalButton('Zapisz wynik');
    saveWithout.onclick = function() {
        saveResultOnly(total + penTotal);
        window.location.reload();
    }
    results.appendChild(saveWithout);
}