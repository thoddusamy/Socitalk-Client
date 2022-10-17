import React, { useState } from 'react'
import './Register.css'
import { FaRegEye } from "react-icons/fa"
import { ImEyeBlocked } from "react-icons/im"
import { Button, Stack } from '@chakra-ui/react'
import { IoIosPersonAdd } from 'react-icons/io'
import { useFormik } from 'formik'
import axios from 'axios'
import { config } from '../../config'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slide } from 'react-toastify'

const Register = () => {

    const [loading, setLoading] = useState(false)
    const [pic, setPic] = useState()

    const errorToast = {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    }

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

    const handleGetPic = (pic) => {
        setLoading(true)
        if (pic == undefined) {
            toast.error("Please_select_a_pic", errorToast)
            return;
        }
        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const data = new FormData()
            data.append("file", pic)
            data.append("upload_preset", "socitalk-chatapp")
            data.append("cloud_name", "thoddusamy")
            fetch("https://api.cloudinary.com/v1_1/thoddusamy/image/upload", {
                method: "post",
                body: data
            }).then((res) => res.json()).then((data) => {
                setPic(data.url.toString())
                setLoading(false)
            }).catch((error) => {
                console.log(error);
                setLoading(false)
            })
        } else {
            toast.error("Invalid_file_format", errorToast)
            setLoading(false)
            return
        }
    }

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            confirm_password: '',
            pic: ''
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

            if (values.confirm_password.length === 0) {
                errors.confirm_password = "confirm_password is Required"
            }

            if (values.password !== values.confirm_password) {
                errors.password = "Password & confirm_password are not same"
            }

            if (values.name.length === 0) {
                errors.name = "Name is Required"
            } else if (values.name.trim().length <= 3) {
                errors.name = "Name length must be more than 3 letters"
            }

            return errors
        },

        onSubmit: async (values, { resetForm }) => {
            try {
                setLoading(true)
                values.pic = pic
                const { data } = await axios.post(`${config.api}/user/register`, values)
                toast.success("Registration_Successfull", successToast)
                // localStorage.setItem("socitalk-userInfo", JSON.stringify(data))
                document.getElementById("upload_pic").value = "";
                resetForm({ values: '' })
                setLoading(false)
            } catch (error) {
                toast.error(error.response.data.message)
                setLoading(false)
            }
        }
    })

    const [showPass, setshowPass] = useState(false)
    const [showConPass, setConShowPass] = useState(false)

    const handleShowHidePass = () => {
        showPass ? setshowPass(false) : setshowPass(true)
    }

    const handleShowHideConPass = () => {
        showConPass ? setConShowPass(false) : setConShowPass(true)
    }

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="register">
                <div className="name">
                    <label htmlFor="name">Name <span className='redstar'>*</span></label>
                    <input type="text" name="name" id="name" placeholder='Enter your name'
                        value={formik.values.name} onChange={formik.handleChange} />
                    {formik.errors.name ? <span className='errorRed'>{formik.errors.name}</span> : null}
                </div>
                <div className="email">
                    <label htmlFor="email_id">Email Address <span className='redstar'>*</span></label>
                    <input type="email" name="email" id="email_id" placeholder='Enter your email'
                        value={formik.values.email} onChange={formik.handleChange} />
                    {formik.errors.email ? <span className='errorRed'>{formik.errors.email}</span> : null}
                </div>
                <div className="pass">
                    <label htmlFor="pass">Password <span className='redstar'>*</span></label>
                    <input type={showPass ? "text" : "password"} name="password" id="pass" placeholder='Enter your password'
                        value={formik.values.password} onChange={formik.handleChange} />
                    {formik.errors.password ? <span className='errorRed'>{formik.errors.password}</span> : null}
                    {showPass ? <FaRegEye onClick={handleShowHidePass} /> : <ImEyeBlocked onClick={handleShowHidePass} />}
                </div>
                <div className="con_pass">
                    <label htmlFor="con_pass">Confirm password <span className='redstar'>*</span></label>
                    <input type={showConPass ? "text" : "password"} name="confirm_password" id="con_pass" placeholder='Enter your confirm password'
                        value={formik.values.confirm_password} onChange={formik.handleChange} />
                    {formik.errors.confirm_password ? <span className='errorRed'>{formik.errors.confirm_password}</span> : null}
                    {showConPass ? <FaRegEye onClick={handleShowHideConPass} /> : <ImEyeBlocked onClick={handleShowHideConPass} />}
                </div>
                <div className="upload_pic">
                    <label htmlFor="upload_pic">Set profile pic (jpeg (or) png)</label>
                    <input type="file" name="pic" id="upload_pic" onChange={(e) => handleGetPic(e.target.files[0])} />
                </div>
                <div className="res_btn">
                    <Stack>
                        <Button isLoading={loading} type='submit'>
                            Register
                            <IoIosPersonAdd />
                        </Button>
                    </Stack>
                </div>
            </div>
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

export default Register