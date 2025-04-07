import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth";
import Recipes from "./recipes";
import { Modal, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const LoggedIn = () => {
    const [recipes, setRecipes] = useState([])
    const [show, setshow] = useState(false)
    const [recipeId, setRecipeId] = useState(0)
    const { handleSubmit, register, setValue, formState: {errors}  } = useForm()
    
    useEffect(
        () => {
            fetch('/recipe/recipes')
                .then(res => res.json())
                .then(data => {
                    setRecipes(data)
                })
                .catch(err => console.log(err))
        }, []
    )

    const getAllRecipe = () => {
        fetch('/recipe/recipes')
        .then(res => res.json())
        .then(data => {
            setRecipes(data)
        })
        .catch(err => console.log(err))
    }

    const closeModel = () => {
        setshow(false)
    }

    const showModel = (id) => {
        setshow(true)
        setRecipeId(id)
        recipes.map(
            (recipe) => {
                if (recipe.id === id) {
                    setValue('title', recipe.title)
                    setValue('description', recipe.description)
                }
            }
        )
    }

    const updateData = (data) => {
        console.log(data)
        data['id'] = recipeId
        const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY")
        
        const requestData = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(data)
        }

        fetch(`recipe/recipe/${recipeId}`, requestData)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            window.location.reload()    
        })
        .catch(err => console.log(err))
    }

    const deleteRecipe = (id) => {
        const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY")

        const requestData = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            }
        }

        fetch(`recipe/recipe/${id}`, requestData)
        .then(response => response.json())
        .then(data => {
            getAllRecipe()
        })
        .catch(err => console.log(err))
    }

    
    return (
        <div className="recipes container">
            <Modal show={show} size="lg" onHide={closeModel}>
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter recipe name"
                                {
                                ...register("title", { required: true, maxLength: 100 })
                                }
                            />
                            {errors.title && <p style={{ color: "red" }}>Title is required</p>}
                            {errors.title?.type === "maxLength" && <p style={{ color: "red" }}>100 character allowed</p>}

                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Enter recipe description"
                                {
                                ...register("description", { required: true, maxLength: 500 })
                                }
                            />
                            {errors.description && <p style={{ color: "red" }}>Description is required</p>}
                            {errors.description?.type === "maxLength" && <p style={{ color: "red" }}>500 characters are allowed</p>}
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Button variant="primary" onClick={handleSubmit(updateData)} >Save</Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
            <h1>List of Recipes</h1>
            {
                recipes.map(
                    (recipe, index) => (
                        <Recipes
                            title={recipe.title}
                            key={index}
                            description={recipe.description}
                            onClick={() => {showModel(recipe.id)}}
                            onDelete={()=> {deleteRecipe(recipe.id)}}
                        />
                    )
                )
            }
        </div>
    );
};

const LoggedOut = () => {
    return (
        <div className="home container">
            <h1 className="heading">Welcome to the Recipes</h1>
            <Link to='/signup' className="btn btn-primary btn-lg">Get Started</Link>
        </div>
    );
};

const HomePage = () => {
    const [logged] = useAuth();


    return (
        <div>
            {logged ? <LoggedIn /> : <LoggedOut />}
        </div>
    );
};

export default HomePage;
