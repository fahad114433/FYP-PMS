import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MainDashboard = () => {
    let { userInfo } = useSelector((state) => state.auth)
    return (
        <>
            {userInfo.isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />}
        </>
    )
}

export default MainDashboard