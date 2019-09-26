document.addEventListener(
	'DOMContentLoaded',
	() => {
		console.log('IronGenerator JS imported successfully!');
	},
	false
);

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

var modal = document.getElementById('myModal');
var btn = document.getElementById('myBtn');
var span = document.getElementsByClassName('close')[0];

btn.onclick = function() {
	modal.style.display = 'block';
};

span.onclick = function() {
	modal.style.display = 'none';
};

window.onclick = function(event) {
	if (event.target == modal) {
		modal.style.display = 'none';
	}
};
