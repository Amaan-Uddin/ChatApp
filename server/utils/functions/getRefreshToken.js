function parseCookies(cookieHeader) {
	const cookies = {}
	if (!cookieHeader) {
		return cookies
	}
	cookieHeader.split(';').forEach((cookie) => {
		const parts = cookie.split('=')
		cookies[parts.shift().trim()] = decodeURI(parts.join('='))
	})
	return cookies
}

function getRefreshToken(cookieHeader) {
	const cookies = parseCookies(cookieHeader)
	return cookies['refreshToken']
}

module.exports = getRefreshToken
