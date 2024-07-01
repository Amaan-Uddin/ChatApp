import { useContext } from 'react'
import { Outlet } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import Spinner from './Spinner'
function Protected() {
	const { user } = useContext(UserContext)
	// return user.loggedIn ? <Outlet /> : <Navigate to={'/'} />
	return user.loggedIn ? <Outlet /> : <Spinner />
}
export default Protected
