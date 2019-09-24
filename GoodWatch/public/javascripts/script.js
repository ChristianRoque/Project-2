document.addEventListener('DOMContentLoaded', () => {

    console.log('IronGenerator JS imported successfully!');

}, false);



$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('focus')
})