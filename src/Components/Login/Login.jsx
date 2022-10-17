import { Button, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import "./Login.css"
import { BiLogInCircle } from "react-icons/bi"
import { FaRegEye } from "react-icons/fa"
import { ImEyeBlocked } from "react-icons/im"
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify'
import axios from 'axios'
import { config } from '../../config'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const [showPass, setShowPass] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const successToast = {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }

    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },

        validate: (values) => {
            const errors = {}

            if (values.email.length === 0) {
                errors.email = "Email is Required"
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = "Invalid email address"
            }

            if (values.password.length === 0) {
                errors.password = "Password is Required"
            }

            return errors
        },

        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true)
                const { data } = await axios.post(`${config.api}/user/login`, values)
                toast.success("Successfully_LoggedIn", successToast)
                localStorage.setItem("socitalk-userInfo", JSON.stringify(data))
                resetForm({ values: '' })
                setLoading(false)
                navigate('/chats')
            } catch (error) {
                toast.error(error.response.data.message)
                setLoading(false)
            }
        }
    })

    const handleShowHidePass = () => {
        showPass ? setShowPass(false) : setShowPass(true)
    }

    const handleSetGuestCredentials = () => {
        setEmail("guest@gmail.com")
        setPassword("guestPassword")
    }

    useEffect(() => {
        formik.values.email = email
        formik.values.password = password
    }, [email, password])

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className='login'>
                <div className='input_boxs'>
                    <div className='email'>
                        <label htmlFor='email_id'>Email Address <span className='redstar'>*</span></label>
                        <input id="email_id" name='email' type="email" placeholder='Enter your email'
                            value={formik.values.email} onChange={formik.handleChange} />
                        {formik.errors.email ? <span className='errorRed'>{formik.errors.email}</span> : null}
                    </div>
                    <div className='pass'>
                        <label htmlFor='pass'>Password <span className='redstar'>*</span></label>
                        <input id="pass" name='password' type={showPass ? "text" : "password"} placeholder='Enter your password'
                            value={formik.values.password} onChange={formik.handleChange} />
                        {formik.errors.password ? <span className='errorRed'>{formik.errors.password}</span> : null}
                        {showPass ? <FaRegEye onClick={handleShowHidePass} /> : <ImEyeBlocked onClick={handleShowHidePass} />}
                    </div>
                </div>
                <div className="btns">
                    <Stack>
                        <Button isLoading={loading} type='submit' variant='ghost'>
                            Login
                            <BiLogInCircle />
                        </Button>
                        <p>(or)</p>
                        <Button isLoading={loading} type='submit' variant='ghost' onClick={handleSetGuestCredentials}>
                            Login as Guest user
                        </Button>
                    </Stack>
                </div>
            </div >
            <ToastContainer position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Slide} />
        </form>
    )
}

export default Login