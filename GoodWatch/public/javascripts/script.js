document.addEventListener('DOMContentLoaded', () => {

    console.log('IronGenerator JS imported successfully!');

}, false);


function onClick(element) {
    document.getElementById("modal01").style.display = "block";
    document.getElementById("img01").src = element.src;
    document.getElementsByClassName("modal-content").innerHTML = this.alt;
}

var span = document.getElementById('close');
var modal = document.getElementById('modal01');

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};