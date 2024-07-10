import configEnv from '../config/config.env'

export class AuthService {
	constructor(baseUrl) {
		this.baseUrl = baseUrl
	}

	async signup_user(user_data) {
		return await this.responseHandler('/auth/signup', user_data, 'POST')
	}

	async login_user(user_data) {
		return await this.responseHandler('/auth/login', user_data, 'POST')
	}

	async logout_user() {
		return await this.responseHandler('/auth/logout', null, 'GET')
	}

	async getCurrentUser() {
		return await this.responseHandler('/auth/current-user', null, 'GET')
	}

	async

	async responseHandler(endpoint, data, method) {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: method,
				...(data && {
					body: JSON.stringify(data),
					headers: {
						'Content-Type': 'application/json',
					},
				}),
				credentials: 'include',
			})
			const responseMsg = await response.json()
			if (!response.ok) {
				throw new Error(responseMsg.error || 'Something went wrong.')
			}
			return responseMsg
		} catch (error) {
			throw new Error(error.message || 'An unknown error occured in authservice.')
		}
	}
}

const authService = new AuthService(configEnv.serverUrl)

export default authService
