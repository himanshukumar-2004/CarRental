import React from 'react'
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast'

const Login = () => {

    const { setShowLogin, axios, setToken, fetchUser ,navigate } = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event)=>{
        event.preventDefault();
        try {
            const url = state === 'login' ? '/api/user/login' : '/api/user/register'
            const payload = state === 'login' ? { email, password } : { name, email, password }

            const { data } = await axios.post(url, payload)

            if (!data.success) {
                toast.error(data.message || 'Authentication failed')
                return
            }

            const token = data.token
            setToken(token)
            localStorage.setItem('token', token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            await fetchUser()
            setShowLogin(false)
            navigate('/')
            toast.success(state === 'login' ? 'Logged in successfully' : 'Account created')
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Request failed')
        }
    }

  return (
    <div onClick={()=> setShowLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex 
    items-center justify-center text-sm text-gray-600 dark:text-gray-300 bg-black/50'>

        <form onSubmit = {onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col 
        gap-4 m-auto items-start p-8 py-12 w-80 sm:w-88 text-gray-500 dark:text-gray-400 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <p className="text-2xl font-medium m-auto dark:text-white">
                <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
            </p>
            {state === "register" && (
                <div className="w-full">
                    <p>Name</p>
                    <input onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" 
                    className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 outline-primary" type="text" required />
                </div>
            )}
            <div className="w-full ">
                <p>Email</p>
                <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 outline-primary" type="email" required />
            </div>
            <div className="w-full ">
                <p>Password</p>
                <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white rounded w-full p-2 mt-1 outline-primary" type="password" required />
            </div>
            {state === "register" ? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                </p>
            )}
            <button className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                {state === "register" ? "Create Account" : "Login"}
            </button>
        </form>
      
    </div>
  )
}

export default Login
