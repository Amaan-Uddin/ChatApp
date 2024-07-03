import { useContext, useEffect, useRef, useState } from 'react'
import { Input, Button, MemoizedAvatar, Logo } from '../utils'
import { UserContext } from '../../context/UserContext'
import { useForm } from 'react-hook-form'

function Chat() {
	const { user } = useContext(UserContext)
	const { register, handleSubmit, resetField } = useForm()
	const [webSocket, setWebSocket] = useState(null)
	const [onlineUsers, setOnlineUsers] = useState([])
	const [selectUser, setSelectUser] = useState(null)
	const [messages, setMessages] = useState([])
	const messageBoxRef = useRef(null)
	useEffect(() => {
		const socket = new WebSocket('ws://localhost:4040')
		setWebSocket(socket)
		socket.addEventListener('message', handleMessage)
		// socket.onmessage = (event) => {
		// 	const data = JSON.parse(event.data)
		// 	if (data.type === 'online') {
		// 		const uniqueUsers = new Map()
		// 		data.users = data.users.filter((clients) => clients._id !== user._id)
		// 		data.users.forEach((user) => {
		// 			uniqueUsers.set(user._id, user)
		// 		})
		// 		setOnlineUsers(Array.from(uniqueUsers.values()))
		// 	}
		// }
		return () => {
			socket.removeEventListener('message', handleMessage)
			socket.close()
		}
	}, [])

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
			console.log(data)
			setMessages((prev) => [...prev, { text: data.message.content, isOur: false, sender: data.message.sender }])
		}
	}

	function sendMessage(data) {
		console.log(data)
		webSocket.send(
			JSON.stringify({
				type: 'message',
				message: { sender: user._id, recipient: selectUser, content: data.message },
			})
		)
		resetField('message')
		setMessages((prev) => [...prev, { text: data.message, isOur: true, sender: user._id }])
	}

	const scrollToBottom = () => {
		if (messageBoxRef.current) {
			messageBoxRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	return (
		<div className="flex">
			<div className="w-1/3 bg-white h-screen">
				<Logo className="mt-2" />
				<ul className="my-4 z-10">
					{onlineUsers.map((user) => (
						<button
							onClick={() => setSelectUser(user._id)}
							key={user._id}
							className={`border-b border-gray-100 py-4 px-4 flex gap-2 items-center cursor-pointer w-full ${
								user._id === selectUser ? 'bg-sky-100 border-l-4 border-l-blue-500' : ''
							}`}
						>
							<MemoizedAvatar _id={user._id} name={user.name} />
							<span>{user.name}</span>
						</button>
					))}
				</ul>
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
										className={`p-2 my-1 inline-flex max-w-72 rounded-lg text-sm break-words w-full ${
											message.sender === user._id
												? 'bg-blue-500 text-white self-end'
												: 'bg-white text-gray-600 self-start'
										}  `}
									>
										<div className="break-words w-full">
											sender: {`${message.sender}`} <br />
											myId: {`${user._id}`} <br />
											message: {`${message.text}`} <br />
										</div>
									</div>
								))}
								<div ref={messageBoxRef} />
							</div>
						</div>
					)}
				</div>
				{selectUser && (
					<form className="flex gap-1 w-full px-1 mb-1 bg-white" onSubmit={handleSubmit(sendMessage)}>
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
