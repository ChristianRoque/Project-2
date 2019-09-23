function persistence(num) {
	let arr = num.toString().split('');
	let total = num;
	let fingers = 0;
	while (total > 9) {
		total = arr.reduce((counter, currentValue) => counter * currentValue);
		total = total.toString().split('');
		arr = total;
		total = total.join('');
		fingers++;
	}
	console.log(fingers);
	return fingers;
}

persistence(999);
