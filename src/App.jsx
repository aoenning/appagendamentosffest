import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Navigate to="/nova-reserva" replace />} />
                    <Route path="/nova-reserva" element={
                        <div className="space-y-8">
                            <div className="text-center max-w-2xl mx-auto">
                                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Agende sua Festa</h2>
                                <p className="mt-4 text-lg text-gray-500">
                                    Preencha o formulário abaixo para garantir sua data. É rápido e fácil.
                                </p>
                            </div>
                            <ReservationForm />
                        </div>
                    } />
                    <Route path="/reservas" element={<ReservationList />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
