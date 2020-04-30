function next() {
    document.getElementById("text").innerHTML = "To jest tekst 2.";
    var n = <HTMLInputElement> document.getElementById("next");
    n.disabled = true;
    var p = <HTMLInputElement> document.getElementById("prev");
    p.disabled = false;
}

function previous() {
    document.getElementById("text").innerHTML = "To jest tekst 1.";
    var n = <HTMLInputElement> document.getElementById("next");
    n.disabled = false;
    var p = <HTMLInputElement> document.getElementById("prev");
    p.disabled = true;
}