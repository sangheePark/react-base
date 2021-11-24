import { makeStyles, SwipeableDrawer } from '@material-ui/core'
import { PushList } from '@pages/index'
import React, { useEffect, useState } from 'react'
import { RootState } from '@reducers/index'
import { useSelector } from 'react-redux'
import { setGlobalBackFunction } from '@common/AppProvider'

type Props = {
	isShow?: boolean
	onClose?: () => void
}

const useStyles = makeStyles({
	borderRadius: {
		'border-radius': '0',
		position: 'relative',
	},
})
const Alarm: React.FC<Props> = ({ onClose = () => {} }) => {
	const [show, setShow] = useState(false)
	const { alarmCnt } = useSelector((state: RootState) => state.push)
	const classes = useStyles()

	useEffect(() => {
		if (show) {
			console.log('Alarm=>setGlobalBackFunction')
			setGlobalBackFunction(() => {
				hide()
			})
		}
	}, [show])

	const hide = () => {
		setShow(false)
		onClose()
	}
	return (
		<>
			<div
				className={'noti'}
				onClick={() => {
					setShow(true)
				}}
			>
				{alarmCnt > 0 && <span className={'badge'}>{alarmCnt}</span>}
			</div>
			<SwipeableDrawer
				classes={{ paper: classes.borderRadius }}
				className="popup_root"
				anchor={'right'}
				open={show}
				onClose={() => {
					hide()
				}}
				onOpen={() => {
					// setShow(true)
				}}
				disableSwipeToOpen={true}
			>
				{show && <></>}
			</SwipeableDrawer>
		</>
	)
}

export default Alarm
