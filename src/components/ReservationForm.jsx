import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Calendar, Users, Phone, User, Save, Loader2, CheckCircle, DollarSign, CreditCard, Table, AlertTriangle } from 'lucide-react';

const ReservationForm = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [reservations, setReservations] = useState([]);
    const [formData, setFormData] = useState({
        clientName: '',
        date: '',
        reservationValue: '',
        advancePayment: '',
        tableQuantity: '',
        guests: '',
        phone: '',
        notes: ''
    });

    // Fetch existing reservations to check for reserved dates
    useEffect(() => {
        const q = query(collection(db, "reservations"), orderBy("date", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const reservationsData = [];
            querySnapshot.forEach((doc) => {
                reservationsData.push({ id: doc.id, ...doc.data() });
            });
            setReservations(reservationsData);
        });

        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Check if selected date is already reserved
    const getReservationsForDate = (selectedDate) => {
        if (!selectedDate) return [];
        return reservations.filter(reservation => reservation.date === selectedDate);
    };

    const reservationsOnSelectedDate = getReservationsForDate(formData.date);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await addDoc(collection(db, "reservations"), {
                ...formData,
                createdAt: new Date(),
                status: 'pending'
            });

            setSuccess(true);
            setFormData({
                clientName: '',
                date: '',
                reservationValue: '',
                advancePayment: '',
                tableQuantity: '',
                guests: '',
                phone: '',
                notes: ''
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error("Erro ao salvar reserva: ", error);
            alert('Erro ao salvar reserva. Verifique o console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {success && (
                <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                        <p className="text-green-800 font-semibold">Reserva salva com sucesso!</p>
                        <p className="text-green-600 text-sm">A reserva foi adicionada à lista.</p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calendar className="w-6 h-6" />
                        Nova Reserva
                    </h2>
                    <p className="text-indigo-100 text-sm mt-1">Preencha os dados para agendar uma nova festa</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-4">
                        {/* Client Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Nome do Cliente <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="clientName"
                                    required
                                    value={formData.clientName}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Data do Evento <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                />
                            </div>

                            {/* Date Availability Indicator */}
                            {formData.date && (
                                <div className="mt-3">
                                    {reservationsOnSelectedDate.length === 0 ? (
                                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-semibold text-green-800">Data disponível</p>
                                                <p className="text-xs text-green-600">Nenhuma reserva encontrada para esta data</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 space-y-2">
                                            <div className="flex items-start gap-2">
                                                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-semibold text-yellow-800">
                                                        Data já reservada ({reservationsOnSelectedDate.length} {reservationsOnSelectedDate.length === 1 ? 'reserva' : 'reservas'})
                                                    </p>
                                                    <p className="text-xs text-yellow-600 mt-1">
                                                        Esta data já possui reserva(s). Você pode continuar, mas verifique se é intencional.
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Show existing reservation details */}
                                            <div className="space-y-2 mt-2">
                                                {reservationsOnSelectedDate.map((reservation, index) => (
                                                    <div key={reservation.id} className="bg-white border border-yellow-200 rounded-md p-2 text-xs">
                                                        <div className="flex items-center gap-2 text-gray-700">
                                                            <User className="w-3.5 h-3.5 text-yellow-600" />
                                                            <span className="font-semibold">{reservation.clientName}</span>
                                                        </div>
                                                        {reservation.guests && (
                                                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                                <Users className="w-3.5 h-3.5 text-yellow-600" />
                                                                <span>{reservation.guests} convidados</span>
                                                            </div>
                                                        )}
                                                        {reservation.phone && (
                                                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                                <Phone className="w-3.5 h-3.5 text-yellow-600" />
                                                                <span>{reservation.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Reservation Value */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Valor da Reserva <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="reservationValue"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.reservationValue}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                        placeholder="Ex: 1500.00"
                                    />
                                </div>
                            </div>

                            {/* Advance Payment */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Valor Adiantado
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="advancePayment"
                                        min="0"
                                        step="0.01"
                                        value={formData.advancePayment}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                        placeholder="Ex: 500.00"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Table Quantity (Optional) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Quantidade de Mesas
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Table className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="tableQuantity"
                                        min="1"
                                        value={formData.tableQuantity}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                        placeholder="Ex: 10"
                                    />
                                </div>
                            </div>

                            {/* Guests (Optional) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nº de Convidados
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Users className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        name="guests"
                                        min="1"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                        placeholder="Ex: 100"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                WhatsApp / Telefone <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
                                    placeholder="Ex: 11999999999"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Observações
                            </label>
                            <textarea
                                name="notes"
                                rows="4"
                                value={formData.notes}
                                onChange={handleChange}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm resize-none"
                                placeholder="Detalhes adicionais sobre a festa..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3.5 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Salvar Reserva
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReservationForm;
