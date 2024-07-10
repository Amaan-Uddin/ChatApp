import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'

const Avatar = ({ _id, name, online }) => {
	const bgColors = useMemo(
		() => [
			'bg-red-200',
			'bg-teal-200',
			'bg-green-200',
			'bg-lime-200',
			'bg-blue-200',
			'bg-sky-200',
			'bg-yellow-200',
			'bg-cyan-200',
			'bg-emerald-200',
			'bg-amber-200',
			'bg-orange-200',
			'bg-yellow-200',
		],
		[]
	)
	const hashCode = (str) => {
		return str.split('').reduce((acc, char) => {
			return char.charCodeAt(0) + ((acc << 5) - acc)
		}, 0)
	}

	const color = useMemo(() => {
		const hash = hashCode(_id)
		const colorIndex = Math.abs(hash) % bgColors.length
		return bgColors[colorIndex]
	}, [_id, bgColors])

	return (
		<div className={`w-11 h-11 flex items-center justify-center rounded-full ${color} relative`}>
			{name[0]}
			<div
				className={`size-3 ${online ? 'bg-green-400' : 'bg-gray-400'} rounded-lg absolute bottom-1 right-0`}
			></div>
		</div>
	)
}

Avatar.propTypes = {
	_id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
}

const MemoizedAvatar = memo(Avatar)
MemoizedAvatar.displayName = 'Avatar'

export default MemoizedAvatar
