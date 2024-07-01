import { forwardRef, useId } from 'react'

const Input = forwardRef(({ type = 'text', label, className = '', ...props }, ref) => {
	const id = useId()
	return (
		<div className="my-1 w-full">
			{label && (
				<label htmlFor={id} className="text-sm text-gray-700 w-full">
					{label}
				</label>
			)}
			<input
				type={type}
				className={`border border-gray-300 py-1 px-2 rounded-sm outline-none w-full ${className}`}
				{...props}
				ref={ref}
				id={id}
			/>
		</div>
	)
})

Input.displayName = 'Input'

export default Input
