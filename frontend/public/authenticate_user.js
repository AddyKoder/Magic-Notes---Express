cookies = document.cookie;
pairs = document.cookie.split('; ');
for (i of pairs) {
	pair = i.split('=');
	if (pair[0] === 'mail') mail = pair[1];
	else if (pair[0] === 'pwd') pwd = pair[1];
}
if (mail && pwd) {
	async function verify() {
		let response = await fetch(`/verify?mail=${mail}&pwd=${pwd}`);
		if ((await response.text()) === 'true') {
			location.href = '/dashboard';
		}
	}
	verify();
}
