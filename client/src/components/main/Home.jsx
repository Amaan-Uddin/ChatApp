import { Button, Container } from '../utils'
import { Link } from 'react-router-dom'
function Home() {
	return (
		<div className="h-screen flex flex-col justify-center">
			<Container className="flex gap-2 justify-center">
				<Link className="w-1/4" to={'/signup'}>
					<Button className=" w-full">Sign up</Button>
				</Link>
				<Link className="w-1/4" to={'login'}>
					<Button className="w-full bg-green-500">Login</Button>
				</Link>
			</Container>
		</div>
	)
}
export default Home
