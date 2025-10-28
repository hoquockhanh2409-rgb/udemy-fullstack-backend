'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAdmin, logout, getAllUsers } from '@/lib/auth';
import { getToys, getBorrowRecords } from '@/lib/store';
import { User, Toy, BorrowRecord } from '@/types';

export default function AdminDashboard() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [toys, setToys] = useState<Toy[]>([]);
    const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'toys' | 'borrows'>('overview');

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || !isAdmin()) {
            router.push('/login');
            return;
        }
        setCurrentUser(user);
        setUsers(getAllUsers());
        setToys(getToys());
        setBorrows(getBorrowRecords());
    }, [router]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!currentUser) return null;

    const stats = {
        totalUsers: users.length,
        totalToys: toys.length,
        activeBorrows: borrows.filter(b => b.status === 'active').length,
        pendingRequests: borrows.filter(b => b.status === 'pending').length,
        customers: users.filter(u => u.role === 'customer').length,
        employees: users.filter(u => u.role === 'employee').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">👑</span>
                            <div>
                                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
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
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'overview'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        📊 Tổng quan
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'users'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        👥 Người dùng ({users.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('toys')}
                        className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'toys'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        🧸 Đồ chơi ({toys.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('borrows')}
                        className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${activeTab === 'borrows'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        📦 Giao dịch ({borrows.length})
                    </button>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                            <div className="text-3xl mb-2">👥</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.totalUsers}</div>
                            <div className="text-gray-600">Tổng người dùng</div>
                            <div className="mt-2 text-sm text-gray-500">
                                {stats.customers} khách hàng, {stats.employees} nhân viên
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                            <div className="text-3xl mb-2">🧸</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.totalToys}</div>
                            <div className="text-gray-600">Tổng đồ chơi</div>
                            <div className="mt-2 text-sm text-gray-500">
                                {toys.filter(t => t.available).length} có sẵn
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                            <div className="text-3xl mb-2">📦</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.activeBorrows}</div>
                            <div className="text-gray-600">Đang cho mượn</div>
                            <div className="mt-2 text-sm text-gray-500">
                                Giao dịch đang hoạt động
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                            <div className="text-3xl mb-2">⏳</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.pendingRequests}</div>
                            <div className="text-gray-600">Chờ duyệt</div>
                            <div className="mt-2 text-sm text-gray-500">
                                Yêu cầu cần xử lý
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tên</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Vai trò</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SĐT</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày tạo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                        user.role === 'employee' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                    }`}>
                                                    {user.role === 'admin' ? '👑 Admin' :
                                                        user.role === 'employee' ? '👔 Employee' :
                                                            '👤 Customer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.phone || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Đồ chơi</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Người mượn</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Chủ sở hữu</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày mượn</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Dự kiến trả</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {borrows.map((borrow) => (
                                        <tr key={borrow.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-800 font-medium">{borrow.toyName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{borrow.borrowerName}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{borrow.ownerName}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${borrow.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        borrow.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                                            borrow.status === 'returned' ? 'bg-green-100 text-green-800' :
                                                                'bg-red-100 text-red-800'
                                                    }`}>
                                                    {borrow.status === 'pending' ? '⏳ Chờ duyệt' :
                                                        borrow.status === 'active' ? '📦 Đang mượn' :
                                                            borrow.status === 'returned' ? '✅ Đã trả' :
                                                                '❌ Từ chối'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(borrow.borrowDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(borrow.expectedReturnDate).toLocaleDateString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
