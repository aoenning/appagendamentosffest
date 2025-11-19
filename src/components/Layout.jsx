import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PartyPopper, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col font-sans">
            <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 p-2 rounded-xl shadow-lg">
                                <PartyPopper className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent tracking-tight">
                                SF FEST
                            </h1>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex gap-6">
                            <Link
                                to="/nova-reserva"
                                className={`font-medium transition-all px-4 py-2 rounded-lg ${location.pathname === '/nova-reserva'
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                Nova Reserva
                            </Link>
                            <Link
                                to="/reservas"
                                className={`font-medium transition-all px-4 py-2 rounded-lg ${location.pathname === '/reservas'
                                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                                    }`}
                            >
                                Lista de Reservas
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-200">
                            <nav className="flex flex-col gap-2">
                                <Link
                                    to="/nova-reserva"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`font-medium transition-all px-4 py-3 rounded-lg ${location.pathname === '/nova-reserva'
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Nova Reserva
                                </Link>
                                <Link
                                    to="/reservas"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`font-medium transition-all px-4 py-3 rounded-lg ${location.pathname === '/reservas'
                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Lista de Reservas
                                </Link>
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto shadow-inner">
                <div className="max-w-7xl mx-auto px-4 py-6 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} SF FEST. Sistema de Gerenciamento de Reservas.
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                        Desenvolvido com ❤️ para facilitar seu negócio
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
