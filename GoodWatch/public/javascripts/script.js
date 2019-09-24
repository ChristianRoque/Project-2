document.addEventListener('DOMContentLoaded', () => {

    console.log('IronGenerator JS imported successfully!');

}, false);



// $('#myModal').on('shown.bs.modal', function() {
//     $('#myInput').trigger('focus')
// })

function onClick(element) {
    document.getElementById("modal01").style.display = "block";
    document.getElementById("img01").src = element.src;
    document.getElementsByClassName("modal-content").innerHTML = this.alt;
}