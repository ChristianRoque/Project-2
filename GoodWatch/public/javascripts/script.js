document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
	},
	false
);

var span = document.getElementById('close');

function onClick(element) {
	console.log(element.alt);
	var modal = document.getElementById(`modal${element.alt}`);
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
	document.getElementById(`modal${element.alt}`).style.display = 'block';
	document.getElementById('img01').src = element.src;
}

// hello
