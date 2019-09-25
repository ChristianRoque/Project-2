document.addEventListener(
    'DOMContentLoaded',
    () => {
        console.log('IronGenerator JS imported successfully!');
    },
    false
);

function onClick(element) {
<<<<<<< HEAD



    console.log(element.alt);
    var modal = document.getElementById(`modal${element.alt}`);
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    document.getElementById(`modal${element.alt}`).style.display = 'block';
    document.getElementById('img01').src = element.src;
=======
	var modal = document.getElementById(`modal${element.alt}`);

	document.getElementById(`modal${element.alt}`).style.display = 'block';
	document.getElementById('img01').src = element.src;

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
>>>>>>> 30a481e741f327c07766d545bc5ec9ece93b3dc8
}

// hello