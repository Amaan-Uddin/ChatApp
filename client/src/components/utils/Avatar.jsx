import { memo, useMemo } from 'react'
import PropTypes from 'prop-types'

const Avatar = ({ _id, name }) => {
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
			'bg-indigo-200',
		],
		[]
	)

	const color = useMemo(() => {
		const userIdBase10 = parseInt(_id, 12)
		const colorIndex = userIdBase10 % bgColors.length
		return bgColors[colorIndex]
	}, [_id, bgColors])

	return <div className={`w-11 h-11 flex items-center justify-center rounded-full ${color}`}>{name[0]}</div>
}

Avatar.propTypes = {
	_id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
}

const MemoizedAvatar = memo(Avatar)
MemoizedAvatar.displayName = 'Avatar'

export default MemoizedAvatar
