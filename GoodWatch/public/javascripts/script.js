document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
	},
	false
);

function onClick(element) {
	var modal = document.getElementById(`modal${element.alt}`);

	document.getElementById(`modal${element.alt}`).style.display = 'block';
	document.getElementById('img01').src = element.src;

	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
}

// hello
