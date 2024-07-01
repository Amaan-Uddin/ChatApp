import { Input, Button } from '../utils'
function Chat() {
	return (
		<div className="flex">
			<div className="w-1/3 bg-sky-100 h-screen">users</div>
			<div className="w-2/3 bg-blue-100 h-screen flex flex-col ">
				<div className="flex-grow"> hello </div>
				<div className="flex gap-1 w-full px-1 mb-1">
					<Input type="text" placeholder="Write a message..." />
					<Button type="button" className="px-4 my-1">
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
				</div>
			</div>
		</div>
	)
}
export default Chat
