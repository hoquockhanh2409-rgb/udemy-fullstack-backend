import { Toy } from '@/types';
import { useState } from 'react';

interface BorrowModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBorrow: (expectedReturnDate: Date, notes: string) => void;
    toy?: Toy;
}

export default function BorrowModal({ isOpen, onClose, onBorrow, toy }: BorrowModalProps) {
    const [expectedReturnDate, setExpectedReturnDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onBorrow(new Date(expectedReturnDate), notes);
        onClose();
        setExpectedReturnDate('');
        setNotes('');
    };

    if (!isOpen || !toy) return null;

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
                <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-t-2xl">
                    <h2 className="text-2xl font-bold">Yêu cầu mượn đồ chơi</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">{toy.name}</h3>
                        <p className="text-sm text-gray-600">Chủ sở hữu: {toy.ownerName}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày dự kiến trả *
                        </label>
                        <input
                            type="date"
                            required
                            min={today}
                            value={expectedReturnDate}
                            onChange={(e) => setExpectedReturnDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ghi chú
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Thêm ghi chú (không bắt buộc)"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all font-semibold"
                        >
                            Gửi yêu cầu
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
