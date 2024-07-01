import spinner from '../../assets/svg/spinner.svg'

function Spinner() {
	return (
		<div className=" flex h-screen flex-col justify-center items-center ">
			<img src={spinner} alt="Loading..." className="w-20" />
		</div>
	)
}
export default Spinner
