import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import Navbar from "./components/navbar"
import {ExercisesList} from "./pages/exercises-list";
import {EditExercise} from "./pages/edit-exercise";
import CreateExercise from "./pages/create-exercise";
import CreateUser from "./pages/create-user";

import {EstateProvider} from 'estate-react';
import {createEstateClient} from "exercise-tracker-service";

// Create your estate client at the app-level, so it retains its state whilst the user is on the site.
const estateClient = createEstateClient();

function App() {
    return (
        <EstateProvider client={estateClient}>
            <BrowserRouter>
                <div className="container">
                    <Navbar/>
                    <br/>
                    <Routes>
                        <Route index path="/" element={<ExercisesList/>}/>
                        <Route path="/edit/:id" element={<EditExercise/>}/>
                        <Route path="/create" element={<CreateExercise/>}/>
                        <Route path="/user" element={<CreateUser/>}/>
                    </Routes>
                </div>
            </BrowserRouter>
        </EstateProvider>
    );
}

export default App;
