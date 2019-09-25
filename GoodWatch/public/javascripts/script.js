document.addEventListener(
    'DOMContentLoaded',
    () => {
        console.log('IronGenerator JS imported successfully!');
    },
    false
);

var span = document.getElementById('close');

function onClick(element) {
    modal.style.display = 'block';
    document.getElementById('img01').src = element.src;
    document.getElementsByClassName('modal-content').innerHTML = this.alt;
}