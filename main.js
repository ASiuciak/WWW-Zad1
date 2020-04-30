function next() {
    document.getElementById("text").innerHTML = "To jest tekst 2.";
    var n = document.getElementById("next");
    n.disabled = true;
    var p = document.getElementById("prev");
    p.disabled = false;
}
function previous() {
    document.getElementById("text").innerHTML = "To jest tekst 1.";
    var n = document.getElementById("next");
    n.disabled = false;
    var p = document.getElementById("prev");
    p.disabled = true;
}
