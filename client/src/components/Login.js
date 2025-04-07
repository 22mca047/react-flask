import React from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../auth";

const LoginPage = () => {
    
    const navigate = useNavigate();
    const { register, reset, handleSubmit, formState: { errors } } = useForm()

    const loginUser = (data) => {

        const requestData = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
            },
            "body": JSON.stringify(data)
        }

        fetch('/auth/login', requestData)
        .then(response => response.json())
        .then(data => {
            console.log(data.access_token)
            login(data.access_token)
            navigate('/home');
        })
        .catch(error => console.error('Error:', error))

        reset()
    }

    return (
        <div className="container">
            <div className="form">
                <h1>Login Page</h1>
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
                        {errors.username?.type === "maxLength" && <p style={{ color: "red" }}><small>Characters should be 25</small></p>}
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password"
                            placeholder="Your Password"
                            {
                            ...register("password", { required: true, minLength: 8 })
                            }
                        />
                        {errors.password && <p style={{ color: "red" }}><small>Password is required</small></p>}
                        {errors.password?.type === "minLength" && <p style={{ color: "red" }}><small>Character should be 8</small></p>}

                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <Button as="sub" variant="primary" onClick={handleSubmit(loginUser)} >Login</Button>
                    </Form.Group>
                    <br></br>
                    <Form.Group>
                        <small>Do Not have an Account <Link to="/signup">Signup</Link></small>
                    </Form.Group>
                </form>
            </div>
        </div>
    )
}

export default LoginPage