import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from 'react-hook-form'

const SignUpPage = () => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [show, setShow] = useState()
    const [serverResponse, setServerResponse] = useState('')

    const submitForm = (data) => {
        console.log(data)

        if (data.password === data.confirmPassword) {
            const requestFunction = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }

            fetch('/auth/signup', requestFunction)
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    setServerResponse(data.message)
                    console.log(serverResponse)
                    
                    setShow(true)
                })
                .catch(error => console.error('Error:', error))

            reset()
        } else {
            alert("Passwords do not match")
        }
    }
    return (
        <div className="container">
            <div className="form">
                {
                    show ?
                        <>
                            <Alert variant="success" onClose={() => setShow(false)} dismissible>
                                <p>
                                   {serverResponse}
                                </p>
                            </Alert>
                            <h1>Sign Up Page</h1>
                        </>
                        :
                        <h1>Sign Up Page</h1>
                }

                <form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text"
                            placeholder="Your Username"
                            {
                            ...register("username", { required: true, maxLength: 25 })
                            }
                        />
                        {errors.username && <p style={{ color: "red" }}><small>Username is required</small></p>}
                        {errors.username?.type === "maxLength" && <p style={{ color: "red" }}><small>Max character should be 25</small></p>}
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email"
                            placeholder="Your Email"
                            {
                            ...register("email", { required: true, maxLength: 80 })
                            }
                        />
                        {errors.email && <p style={{ color: "red" }}><small>Email is required</small></p>}
                        {errors.email?.type === "maxLength" && <p style={{ color: "red" }}><small>Max characters should be 80</small></p>}
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                            placeholder="Your Password"
                            {
                            ...register("password", { required: true, minLength: 8 })
                            }
                        />
                        {errors.password && <p style={{ color: "red" }}><small>Password is required</small></p>}
                        {errors.password?.type === "minLength" && <p style={{ color: "red" }}><small>Max characters should be 8</small></p>}
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password"
                            placeholder="Your Confirm Password"
                            {
                            ...register("confirmPassword", { required: true, minLength: 8 })
                            }
                        />
                        {errors.confirmPassword && <p style={{ color: "red" }}><small>Confirm Password is required</small></p>}
                        {errors.confirmPassword?.type === "minLength" && <p style={{ color: "red" }}><small>Max characters should be 8</small></p>}
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <Button as="sub" variant="primary"
                            onClick={handleSubmit(submitForm)}
                        >Sign Up</Button>
                    </Form.Group>
                    <br />
                    <Form.Group>
                        <small>Already have an Account <Link to="/login">Login</Link></small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default SignUpPage