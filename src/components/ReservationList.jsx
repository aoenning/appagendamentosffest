import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Calendar, Users, Phone, MessageCircle, User, Search, Trash2, AlertCircle, DollarSign, CreditCard, Table } from 'lucide-react';

const ReservationList = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchMonth, setSearchMonth] = useState('');
    const [searchYear, setSearchYear] = useState(new Date().getFullYear().toString());
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        const q = query(collection(db, "reservations"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const reservationsData = [];
            querySnapshot.forEach((doc) => {
                reservationsData.push({ id: doc.id, ...doc.data() });
            });
            setReservations(reservationsData);
            setFilteredReservations(reservationsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        filterReservations();
    }, [searchMonth, searchYear, reservations]);

    const filterReservations = () => {
        let filtered = [...reservations];

        if (searchYear) {
            filtered = filtered.filter(reservation => {
                const reservationDate = new Date(reservation.date);
                return reservationDate.getFullYear().toString() === searchYear;
            });
        }

        if (searchMonth) {
            filtered = filtered.filter(reservation => {
                const reservationDate = new Date(reservation.date);
                return (reservationDate.getMonth() + 1).toString() === searchMonth;
            });
        }

        setFilteredReservations(filtered);
    };

    const handleWhatsApp = (reservation) => {
        const phone = reservation.phone.replace(/\D/g, '');
        const message = `Olá ${reservation.clientName}, sua reserva para o dia ${new Date(reservation.date).toLocaleDateString('pt-BR')} foi confirmada!`;
        const url = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "reservations", id));
            setDeleteConfirm(null);
        } catch (error) {
            console.error("Erro ao deletar reserva: ", error);
            alert('Erro ao deletar reserva. Verifique o console.');
        }
    };

    const clearFilters = () => {
        setSearchMonth('');
        setSearchYear(new Date().getFullYear().toString());
    };

    const formatCurrency = (value) => {
        if (!value) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const calculateBalance = (total, advance) => {
        const totalValue = parseFloat(total) || 0;
        const advanceValue = parseFloat(advance) || 0;
        return totalValue - advanceValue;
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-500">Carregando reservas...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar className="w-7 h-7 text-indigo-600" />
                        Reservas
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Gerencie todas as suas reservas
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative">
                        <select
                            value={searchMonth}
                            onChange={(e) => setSearchMonth(e.target.value)}
                            className="appearance-none w-full sm:w-auto pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm text-sm"
                        >
                            <option value="">Todos os meses</option>
                            <option value="1">Janeiro</option>
                            <option value="2">Fevereiro</option>
                            <option value="3">Março</option>
                            <option value="4">Abril</option>
                            <option value="5">Maio</option>
                            <option value="6">Junho</option>
                            <option value="7">Julho</option>
                            <option value="8">Agosto</option>
                            <option value="9">Setembro</option>
                            <option value="10">Outubro</option>
                            <option value="11">Novembro</option>
                            <option value="12">Dezembro</option>
                        </select>
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    <div className="relative">
                        <select
                            value={searchYear}
                            onChange={(e) => setSearchYear(e.target.value)}
                            className="appearance-none w-full sm:w-auto pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm text-sm"
                        >
                            <option value="">Todos os anos</option>
                            {[...Array(5)].map((_, i) => {
                                const year = new Date().getFullYear() - 1 + i;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>

                    {(searchMonth || searchYear !== new Date().getFullYear().toString()) && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors shadow-sm"
                        >
                            Limpar Filtros
                        </button>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">
                        Mostrando {filteredReservations.length} de {reservations.length} reservas
                    </span>
                </div>
            </div>

            {filteredReservations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border-2 border-gray-200 border-dashed">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                        {reservations.length === 0
                            ? 'Nenhuma reserva encontrada.'
                            : 'Nenhuma reserva encontrada para os filtros selecionados.'}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                        {reservations.length === 0
                            ? 'Crie sua primeira reserva!'
                            : 'Tente ajustar os filtros de busca.'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredReservations.map((reservation) => (
                        <div key={reservation.id} className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2 mb-2">
                                            <User className="w-5 h-5 text-indigo-500" />
                                            {reservation.clientName}
                                        </h3>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${reservation.status === 'confirmed'
                                                ? 'bg-green-100 text-green-800 border border-green-200'
                                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                            }`}>
                                            {reservation.status === 'confirmed' ? '✓ Confirmado' : '⏳ Pendente'}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2.5 text-sm text-gray-600">
                                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                        <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                        <span className="font-medium">{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                                    </div>

                                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                        <Table className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                        <span className="font-medium">{reservation.tableQuantity || 'N/A'} mesas</span>
                                    </div>

                                    {reservation.guests && (
                                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                            <Users className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                            <span className="font-medium">{reservation.guests} convidados</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                        <Phone className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                        <span className="font-medium break-all">{reservation.phone}</span>
                                    </div>
                                </div>

                                {/* Financial Information */}
                                <div className="border-t border-gray-200 pt-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600 flex items-center gap-1">
                                            <DollarSign className="w-4 h-4 text-green-600" />
                                            Valor Total:
                                        </span>
                                        <span className="font-bold text-green-700">
                                            {formatCurrency(reservation.reservationValue)}
                                        </span>
                                    </div>

                                    {reservation.advancePayment && parseFloat(reservation.advancePayment) > 0 && (
                                        <>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600 flex items-center gap-1">
                                                    <CreditCard className="w-4 h-4 text-blue-600" />
                                                    Adiantado:
                                                </span>
                                                <span className="font-semibold text-blue-700">
                                                    {formatCurrency(reservation.advancePayment)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                <span className="text-sm font-semibold text-amber-800">
                                                    Saldo Restante:
                                                </span>
                                                <span className="font-bold text-amber-900">
                                                    {formatCurrency(calculateBalance(reservation.reservationValue, reservation.advancePayment))}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {reservation.notes && (
                                    <div className="text-sm text-gray-600 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                        <p className="italic line-clamp-2">"{reservation.notes}"</p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <button
                                        onClick={() => handleWhatsApp(reservation)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 px-4 rounded-lg transition-colors font-medium text-sm shadow-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        <span className="hidden sm:inline">Enviar</span> WhatsApp
                                    </button>

                                    {deleteConfirm === reservation.id ? (
                                        <div className="flex-1 flex gap-2">
                                            <button
                                                onClick={() => handleDelete(reservation.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-3 rounded-lg transition-colors font-medium text-sm shadow-sm"
                                            >
                                                Confirmar
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirm(null)}
                                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2.5 px-3 rounded-lg transition-colors font-medium text-sm"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirm(reservation.id)}
                                            className="sm:w-auto flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-lg transition-colors font-medium text-sm border border-red-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span className="hidden sm:inline">Deletar</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReservationList;
