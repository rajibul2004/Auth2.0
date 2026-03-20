import axios from 'axios'
import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const Context = createContext()

const AppContextProvider = (props) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [authChecked, setAuthChecked] = useState(false)

    // Get user data from server
    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/auth/me', {
                withCredentials: true,
                timeout: 10000 
            })            
            if (data.success) {
                setUserData(data.userData)
                return { success: true, data: data.userData }
            } else {
                toast.error(data.message || 'Failed to fetch user data')
                return { success: false, error: data.message }
            }
        } catch (err) {            
            if (err.code === 'ECONNABORTED') {
                toast.error('Request timeout. Please check your connection.')
            } else if (err.response) {
                toast.error(err.response.data?.message || 'Server error')
            } else if (err.request) {
                toast.error('Cannot connect to server. Please try again.')
            } else {
                toast.error(err.message || 'An error occurred')
            }
            return { success: false, error: err.message }
        }
    }
    
    const getAuthState = async () => {
        setLoading(true)
        try {            
            const { data } = await axios.get(backendUrl + '/auth/is-auth', {
                withCredentials: true,
                timeout: 8000 
            })
            
            if (data.success) {
                setIsLoggedin(true)
                await getUserData()
            } else {
                setIsLoggedin(false)
                setUserData(null)
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setIsLoggedin(false)
                setUserData(null)
            } else {
                if (err.code === 'ECONNABORTED') {
                    toast.error('Connection timeout. Please refresh the page.')
                } else if (err.response) {
                    toast.error(err.response.data?.message || 'Server error')
                } else if (err.request) {
                    toast.error('Cannot connect to server. Please check your internet connection.')
                }
                setIsLoggedin(false)
                setUserData(null)
            }
        } finally {
            setLoading(false)
            setAuthChecked(true)
        }
    }

    const logout = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/auth/logout', {}, {
                withCredentials: true,
                timeout: 5000
            })
            
            if (data.success) {
                setIsLoggedin(false)
                setUserData(null)
                toast.success('Logged out successfully')
                return { success: true }
            } else {
                toast.error(data.message || 'Logout failed')
                return { success: false, error: data.message }
            }
        } catch (err) {
            console.error('Logout error:', err)
            toast.error(err.response?.data?.message || 'Logout failed')
            return { success: false, error: err.message }
        }
    }

    const clearUserData = () => {
        setUserData(null)
        setIsLoggedin(false)
    }

    const refreshUserData = async () => {
        if (isLoggedin) {
            return await getUserData()
        }
        return { success: false, error: 'Not logged in' }
    }

    useEffect(() => {
        getAuthState()
    }, [])

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        loading,
        authChecked,
        
        getUserData,
        logout,
        clearUserData,
        refreshUserData
    }

    if (loading && !authChecked) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
                    
                    {/* Logo in center (optional) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )
    }
    console.log(import.meta.env.VITE_BACKEND_URL)

    return (
        <Context.Provider value={value}>
            {props.children}
        </Context.Provider>
    )
}

export default AppContextProvider
export { Context }