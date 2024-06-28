function Button({ children, type = 'button', className = '', ...props }) {
	return (
		<button type={type} className={`bg-blue-600 text-white py-1 rounded-sm ${className}`} {...props}>
			{children}
		</button>
	)
}
export default Button
