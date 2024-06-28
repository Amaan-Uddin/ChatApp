import { Input, Button, Container, ErrorMessage } from '../../utils'
import { useForm } from 'react-hook-form'
import authService from '../../../services/auth_service'

function SignupComponent() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm()

	async function signup(data) {
		console.log(data)
		try {
			const response = await authService.signup_user(data)
			console.log(response)
		} catch (error) {
			console.error(error)
			if (error.field) {
				setError(error.field, { type: 'manual', message: error.message })
			} else {
				setError('server', { type: 'server', message: error.message })
			}
		}
	}

	return (
		<form
			onSubmit={handleSubmit(signup)}
			className="md:w-1/2 sm:w-3/4 mx-auto h-screen justify-center flex flex-col"
		>
			<Container className="container flex gap-1 flex-col">
				{errors.server && (
					<div className="p-2 bg-red-200">
						<ErrorMessage>{errors.server.message}</ErrorMessage>
					</div>
				)}

				<div>
					<Input
						{...register('name', {
							required: 'Name is required.',
							pattern: { value: /^[A-Za-z\s]+$/, message: 'Name must contain only alphabets' },
						})}
						placeholder="Enter name..."
						label="Name"
					/>
					{errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
				</div>
				<div>
					<Input
						{...register('email', {
							required: 'Email is required.',
						})}
						type="email"
						placeholder="Enter email..."
						label="Email"
					/>
					{errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
				</div>
				<div>
					{/* TODO : add a show password feature */}
					<Input
						{...register('password', {
							required: 'Password is required.',
							pattern: {
								value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]+$/,
								message:
									'Password must contain at least one uppercase letter, one lowercase letter, one number, and no symbols',
							},
						})}
						type="password"
						placeholder="Enter password"
						label="Password"
					/>
					{errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
				</div>
				<Button type="submit" className="my-3">
					Signup
				</Button>
			</Container>
		</form>
	)
}
export default SignupComponent
