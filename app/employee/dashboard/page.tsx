'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isEmployee, logout } from '@/lib/auth';
import { getToys, getBorrowRecords, updateBorrowStatus } from '@/lib/store';
import { User, Toy, BorrowRecord } from '@/types';

export default function EmployeeDashboard() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [toys, setToys] = useState<Toy[]>([]);
    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'toys' | 'borrows'>('overview');

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || !isEmployee()) {
            router.push('/login');
            return;
        }
        setCurrentUser(user);
        loadData();
    }, [router]);

    const loadData = () => {
        setToys(getToys());
        setBorrows(getBorrowRecords());
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const handleApproveBorrow = (borrowId: string) => {
        updateBorrowStatus(borrowId, 'active');
        loadData();
    };

    const handleRejectBorrow = (borrowId: string) => {
        updateBorrowStatus(borrowId, 'rejected');
        loadData();
    };

    const handleMarkReturned = (borrowId: string) => {
        updateBorrowStatus(borrowId, 'returned');
        loadData();
    };

    if (!currentUser) return null;

    const stats = {
        totalToys: toys.length,
        availableToys: toys.filter(t => t.available).length,
        activeBorrows: borrows.filter(b => b.status === 'active').length,
        pendingRequests: borrows.filter(b => b.status === 'pending').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">👔</span>
                            <div>
                                <h1 className="text-2xl font-bold">Employee Dashboard</h1>
                                <p className="text-sm opacity-90">{currentUser.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg transition-colors font-semibold"
                        >
                            Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'overview'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        📊 Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('toys')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'toys'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        🧸 Đồ chơi ({toys.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('borrows')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'borrows'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        📦 Yêu cầu mượn ({stats.pendingRequests})
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                            <div className="text-3xl mb-2">🧸</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.totalToys}</div>
                            <div className="text-gray-600">Tổng đồ chơi</div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                            <div className="text-3xl mb-2">✅</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.availableToys}</div>
                            <div className="text-gray-600">Có sẵn</div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                            <div className="text-3xl mb-2">📦</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.activeBorrows}</div>
                            <div className="text-gray-600">Đang cho mượn</div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                            <div className="text-3xl mb-2">⏳</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.pendingRequests}</div>
                            <div className="text-gray-600">Chờ duyệt</div>
                        </div>
                    </div>
                )}

                {/* Toys Tab */}
                {activeTab === 'toys' && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên đồ chơi</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Danh mục</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Chủ sở hữu</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tình trạng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {toys.map((toy) => (
                                        <tr key={toy.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{toy.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{toy.category}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{toy.ownerName}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${toy.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {toy.available ? '✅ Có sẵn' : '🔒 Đang mượn'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{toy.condition}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Borrows Tab */}
                {activeTab === 'borrows' && (
                    <div className="space-y-4">
                        {borrows.filter(b => b.status === 'pending' || b.status === 'active').length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                                <div className="text-6xl mb-4">✅</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Không có yêu cầu nào
                                </h3>
                            </div>
                        ) : (
                            borrows.filter(b => b.status === 'pending' || b.status === 'active').map((borrow) => (
                                <div key={borrow.id} className="bg-white rounded-xl shadow-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{borrow.toyName}</h3>
                                            <div className="space-y-1 text-sm text-gray-600">
                                                <p><strong>Người mượn:</strong> {borrow.borrowerName}</p>
                                                <p><strong>Chủ sở hữu:</strong> {borrow.ownerName}</p>
                                                <p><strong>Ngày mượn:</strong> {new Date(borrow.borrowDate).toLocaleDateString('vi-VN')}</p>
                                                <p><strong>Dự kiến trả:</strong> {new Date(borrow.expectedReturnDate).toLocaleDateString('vi-VN')}</p>
                                                {borrow.notes && <p><strong>Ghi chú:</strong> {borrow.notes}</p>}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${borrow.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                            }`}>
                                            {borrow.status === 'pending' ? '⏳ Chờ duyệt' : '📦 Đang mượn'}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        {borrow.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApproveBorrow(borrow.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                                                >
                                                    ✅ Chấp nhận
                                                </button>
                                                <button
                                                    onClick={() => handleRejectBorrow(borrow.id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                                                >
                                                    ❌ Từ chối
                                                </button>
                                            </>
                                        )}
                                        {borrow.status === 'active' && (
                                            <button
                                                onClick={() => handleMarkReturned(borrow.id)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                                            >
                                                ✅ Đánh dấu đã trả
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
