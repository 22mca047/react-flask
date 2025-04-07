import React, {useEffect} from "react";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


const CreateRacipePage = () => {
    const nevigate = useNavigate()

    useEffect(
        () => {
            const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY")
            if (!token) {
                nevigate('/')
            }
        }
    )

    const { register, handleSubmit, reset, formState:{errors} } = useForm();

    const submitData = (data) => {
        console.log(data);

        const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY")
        
        const requestData = {
            "method": "POST",
            "headers":{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${JSON.parse(token)}`,
            },
            "body": JSON.stringify(data),
        } 

        fetch('/recipe/recipes', requestData)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error:', error))
        reset()
    }

    return(
        <div className="container">
            <h1>Create Recipe</h1>
            <Form>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" placeholder="Enter recipe name" 
                    {
                        ...register("title", {required:true,maxLength:100})
                    }
                    />
                    {errors.title && <p style={{color:"red"}}>Title is required</p>}
                    {errors.title?.type === "maxLength" && <p style={{color:"red"}}>100 character allowed</p>}
                    
                </Form.Group>
                <br></br>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter recipe description" 
                    {
                        ...register("description", {required:true,maxLength:500})
                    }
                    />
                    {errors.description && <p style={{color:"red"}}>Description is required</p>}
                    {errors.description?.type === "maxLength" && <p style={{color:"red"}}>500 characters are allowed</p>}
                </Form.Group>
                <br></br>
                <Form.Group>
                    <Button variant="primary" onClick={handleSubmit(submitData)} >Save</Button>
                </Form.Group>
            </Form>
        </div>
    )
}

export default CreateRacipePage