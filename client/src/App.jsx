import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Protected, Spinner } from './components/utils'

const SignupPage = lazy(() => import('./pages/SignupPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))

function App() {
	return (
		<Suspense fallback={<Spinner />}>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/chat" element={<Protected />}>
					<Route index element={<ChatPage />} />
				</Route>
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<div>Not found</div>} />
			</Routes>
		</Suspense>
	)
}

export default App
