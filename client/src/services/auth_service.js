import configEnv from '../config/config.env'

export class AuthService {
	constructor(baseUrl) {
		this.baseUrl = baseUrl
	}

	async signup_user(user_data) {
		return await this.responseHandler('/auth/signup', user_data)
	}

	async login_user(user_data) {
		return await this.responseHandler('/auth/login', user_data)
	}

	async responseHandler(endpoint, data) {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-type': 'application/json',
				},
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
