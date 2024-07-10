import { useContext, useEffect, useRef, useState } from 'react'
import { Input, Button, MemoizedAvatar, Logo } from '../utils'
import { UserContext } from '../../context/UserContext'
import { useForm } from 'react-hook-form'
import configEnv from '../../config/config.env'
import authService from '../../services/auth_service'
import { useNavigate } from 'react-router-dom'

function Chat() {
	const { user, setUser } = useContext(UserContext)
	const navigate = useNavigate()
	const { register, handleSubmit, resetField } = useForm()
	const [webSocket, setWebSocket] = useState(null)
	const [onlineUsers, setOnlineUsers] = useState([])
	const [offlineUsers, setOfflineUsers] = useState([])
	const [selectUser, setSelectUser] = useState(null)
	const [currentConversation, setCurrentConversation] = useState(null)
	const [messages, setMessages] = useState([])

	const messageBoxRef = useRef(null)
	const reconnectAttemptsRef = useRef(0)
	const unsentMessagesRef = useRef([])
	const currentConversationRef = useRef(currentConversation)
	const logoutRef = useRef(false)

	function connectToWebSocket() {
		const socket = new WebSocket('ws://localhost:4040')
		socket.addEventListener('open', () => {
			// console.log('WebSocket connection opened')
			reconnectAttemptsRef.current = 0

			// Send any unsent messages
			while (unsentMessagesRef.current.length > 0) {
				const message = unsentMessagesRef.current.shift()
				socket.send(JSON.stringify(message))
			}
		})

		socket.addEventListener('message', handleMessage)

		socket.addEventListener('close', () => {
			if (!logoutRef.current) {
				attemptReconnect()
			}
		})

		socket.addEventListener('error', () => {
			socket.close()
		})

		setWebSocket(socket)
	}

	function attemptReconnect() {
		if (logoutRef.current) return
		if (reconnectAttemptsRef.current < 10) {
			const timeout = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 30000)
			reconnectAttemptsRef.current += 1

			setTimeout(() => {
				console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current})`)
				connectToWebSocket()
			}, timeout)
		} else {
			console.error('Max reconnect attempts reached')
		}
	}

	function handleMessage(event) {
		const data = JSON.parse(event.data)
		if (data.type === 'online') {
			const uniqueUsers = new Map()
			data.users = data.users.filter((clients) => clients._id !== user._id)
			data.users.forEach((user) => {
				uniqueUsers.set(user._id, user)
			})
			setOnlineUsers(Array.from(uniqueUsers.values()))
		}
		if (data.type === 'message') {
			const { message } = data
			console.log(message)
			if (message.conversationId === currentConversationRef.current) {
				setMessages((prev) => [
					...prev,
					{ text: message.text, isOur: false, sender: message.sender, createdAt: message.createdAt },
				])
			}
		}
	}

	function sendMessage(data) {
		console.log(data)
		const message = {
			type: 'message',
			message: {
				conversationId: currentConversation,
				sender: user._id,
				recipient: selectUser,
				content: data.message,
			},
		}
		if (webSocket && webSocket.readyState === WebSocket.OPEN) {
			webSocket.send(JSON.stringify(message))
		} else {
			unsentMessagesRef.current.push(message)
		}
		resetField('message')
		setMessages((prev) => [
			...prev,
			{ text: data.message, isOur: true, sender: user._id, createdAt: new Date().toISOString() },
		])
	}

	async function handleUserSelect(userId) {
		try {
			setSelectUser(userId)
			const response = await fetch(`${configEnv.serverUrl}/api/set-conversation`, {
				method: 'POST',
				body: JSON.stringify({ userId_1: user._id, userId_2: userId }),
				headers: {
					'Content-type': 'application/json',
				},
				credentials: 'include',
			})
			const responseMsg = await response.json()
			if (!response.ok) throw new Error(responseMsg.error || 'failed to set conversation.')
			console.log(responseMsg)
			setCurrentConversation(responseMsg.conversationId._id)
		} catch (error) {
			console.error(error)
		}
	}

	async function handleLogout() {
		try {
			logoutRef.current = true
			if (webSocket) {
				webSocket.close()
			}
			const response = await authService.logout_user()
			if (response.message) {
				setUser({
					_id: undefined,
					name: undefined,
					email: undefined,
					loggedIn: false,
				})
				navigate('/')
			}
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		currentConversationRef.current = currentConversation
	}, [currentConversation])

	useEffect(() => {
		connectToWebSocket()

		return () => {
			if (webSocket) webSocket.close()
		}
	}, [])

	useEffect(() => {
		async function fetchMessages() {
			try {
				const response = await fetch(
					`${configEnv.serverUrl}/api/messages?conversationId=${currentConversation}`,
					{
						method: 'GET',
						credentials: 'include',
					}
				)
				const responseMsg = await response.json()
				if (!response.ok) throw new Error(responseMsg.error || 'Failed to fetch messages')
				setMessages(responseMsg.messages)
			} catch (error) {
				console.error(error)
			}
		}
		if (currentConversation) {
			fetchMessages()
		}
	}, [currentConversation])

	useEffect(() => {
		async function fetchOfflineUsers() {
			try {
				const response = await fetch(`${configEnv.serverUrl}/api/offline`, {
					method: 'GET',
					credentials: 'include',
				})
				const responseMsg = await response.json()
				if (!response.ok) throw new Error(responseMsg.error || 'Failed to fetch offline users.')
				// console.log(responseMsg)
				setOfflineUsers(responseMsg)
			} catch (error) {
				console.error(error)
			}
		}
		fetchOfflineUsers()
	}, [onlineUsers])

	useEffect(() => {
		if (messageBoxRef.current) {
			messageBoxRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	return (
		<div className="flex">
			<div className="w-1/3 bg-white h-screen flex flex-col">
				<Logo className="mt-2" />
				<ul className="my-4 z-10 flex-1 overflow-y-auto">
					{onlineUsers.map((user) => (
						<button
							onClick={() => {
								handleUserSelect(user._id)
							}}
							key={user._id}
							className={`border-b border-gray-100 py-3 px-4 flex gap-2 items-center cursor-pointer flex-wrap w-full sm:justify-start justify-center ${
								user._id === selectUser ? 'bg-sky-100 border-l-4 border-l-blue-500' : ''
							}`}
						>
							<MemoizedAvatar online={true} _id={user._id} name={user.name} />
							<span>{user.name}</span>
						</button>
					))}
					{offlineUsers.map((user) => (
						<button
							onClick={() => {
								handleUserSelect(user._id)
							}}
							key={user._id}
							className={`border-b border-gray-100 py-3 px-4 flex gap-2 items-center cursor-pointer flex-wrap w-full sm:justify-start justify-center ${
								user._id === selectUser ? 'bg-sky-100 border-l-4 border-l-blue-500' : ''
							}`}
						>
							<MemoizedAvatar online={false} _id={user._id} name={user.name} />
							<span>{user.name}</span>
						</button>
					))}
				</ul>
				<div className="flex items-center w-full justify-center py-0 sm:py-3">
					<div className="bg-zinc-400 flex items-center justify-center gap-2 sm:gap-4 sm:rounded-md px-4 py-2 bg-opacity-15 flex-wrap">
						<div className="flex items-center gap-1 flex-col md:flex-row pt-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="size-6 text-emerald-400"
							>
								<path
									fillRule="evenodd"
									d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
									clipRule="evenodd"
								/>
							</svg>

							<p>{user.name}</p>
						</div>
						<Button className="px-4 py-2 my-1 rounded-lg" onClick={handleLogout}>
							Logout
						</Button>
					</div>
				</div>
			</div>
			<div className="w-2/3 bg-sky-100 h-screen flex flex-col ">
				<div className="flex-grow ">
					{!selectUser && (
						<div className="h-screen flex justify-center items-center text-center text-gray-500 gap-2">
							<p className="text-lg">Select person to start a conversation.</p>
						</div>
					)}
					{selectUser && (
						<div className="relative h-full">
							<div className="p-2 overflow-y-auto flex flex-col absolute inset-0">
								{messages.map((message, index) => (
									<div
										key={index}
										className={`px-2 py-1 my-1 inline-flex max-w-72 rounded-lg text-sm break-words  ${
											message.sender === user._id
												? 'bg-blue-500 text-white self-end'
												: 'bg-white text-gray-600 self-start'
										}  `}
									>
										<div className="flex flex-col">
											<div className="break-words w-full">{message.text}</div>
											<div className="self-end" style={{ fontSize: '11px' }}>
												{new Date(message.createdAt).toLocaleTimeString('en-US', {
													hour: '2-digit',
													minute: '2-digit',
													hour12: false,
												})}
											</div>
										</div>
									</div>
								))}
								<div ref={messageBoxRef} />
							</div>
						</div>
					)}
				</div>
				{selectUser && (
					<form className="flex gap-1 w-full px-1 bg-white" onSubmit={handleSubmit(sendMessage)}>
						<Input
							{...register('message', { required: true })}
							type="text"
							placeholder="Write a message..."
							className="py-2"
							autoComplete="off"
						/>
						<Button type="submit" className="px-4 py-2 my-1">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
								/>
							</svg>
						</Button>
					</form>
				)}
			</div>
		</div>
	)
}
export default Chat
