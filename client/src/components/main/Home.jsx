import { useContext, useEffect } from 'react'
import { UserContext } from '../../context/UserContext'
import { Button, Container, Logo } from '../utils'
import { Link, useNavigate } from 'react-router-dom'
function Home() {
	const { user } = useContext(UserContext)
	const navigate = useNavigate()
	useEffect(() => {
		if (user.loggedIn) {
			navigate('/chat')
		} else {
			navigate('/')
		}
	}, [])
	return (
		<div className="h-screen flex flex-col justify-center">
			<Logo className="my-5" />
			<Container className="flex gap-2 justify-center my-4">
				<Link className="w-1/4" to={'/signup'}>
					<Button className=" w-full">Sign up</Button>
				</Link>
				<Link className="w-1/4" to={'/login'}>
					<Button className="w-full bg-green-500">Login</Button>
				</Link>
			</Container>
		</div>
	)
}
export default Home
