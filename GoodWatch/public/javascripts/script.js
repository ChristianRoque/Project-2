document.addEventListener(
    'DOMContentLoaded',
    () => {
        console.log('IronGenerator JS imported successfully!');
    },
    false
);

var span = document.getElementById('close');
var modal = document.getElementById('modal01');

function onClick(element) {
    modal.style.display = 'block';
    document.getElementById('img01').src = element.src;

}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};