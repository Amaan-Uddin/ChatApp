import { createContext, useEffect, useState } from 'react'
import authService from '../services/auth_service'
import { useNavigate } from 'react-router-dom'
export const UserContext = createContext()

export function UserProvider({ children }) {
	const [user, setUser] = useState({
		_id: undefined,
		name: undefined,
		email: undefined,
		loggedIn: false,
	})
	const navigate = useNavigate()
	useEffect(() => {
		async function fetchCurrentUser() {
			try {
				const userData = await authService.getCurrentUser()
				console.log(userData)
				setUser({ ...userData, loggedIn: true })
			} catch (error) {
				console.error(error)
				navigate('/')
				// TODO: show an error toast
			}
		}
		fetchCurrentUser()
	}, [])
	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
