import 'bootstrap/dist/css/bootstrap.min.css';
import './style/main.css'
import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/Home';
import SignUpPage from './components/SignUp';
import LoginPage from './components/Login';
import CreateRacipePage from './components/CreateRecipe';

const App = () => {

    return (
        <Router>
            <div classname="container">
                <Navbar />
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/create_recipe" element={<CreateRacipePage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/home" element={<HomePage />} />
                </Routes>
            </div>
        </Router>
    )
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
