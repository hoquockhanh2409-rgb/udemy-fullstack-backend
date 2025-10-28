'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyBorrows, getBorrowsForMyToys, updateBorrowStatus } from '@/lib/store';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { BorrowRecord, User } from '@/types';
import Image from 'next/image';

export default function BorrowsPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [activeTab, setActiveTab] = useState<'my-borrows' | 'requests'>('my-borrows');
    const [myBorrows, setMyBorrows] = useState<BorrowRecord[]>([]);
    const [requests, setRequests] = useState<BorrowRecord[]>([]);

    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setCurrentUser(user);
        loadData(user.id);
    }, [router]);

    const loadData = (userId: string) => {
        const myBorrowsData = getMyBorrows(userId);
        const requestsData = getBorrowsForMyToys(userId);
        console.log('My Borrows:', myBorrowsData);
        console.log('Requests for my toys:', requestsData);
        console.log('Pending requests count:', requestsData.filter(r => r.status === 'pending').length);
        setMyBorrows(myBorrowsData);
        setRequests(requestsData);
    };

    if (!currentUser) return null;

    const handleReturnToy = (borrowId: string) => {
        if (confirm('Xác nhận bạn đã trả đồ chơi?')) {
            updateBorrowStatus(borrowId, 'returned');
            if (currentUser) loadData(currentUser.id);
            alert('Đã cập nhật trạng thái trả đồ chơi!');
        }
    };

    const handleApprove = (borrowId: string) => {
        updateBorrowStatus(borrowId, 'active');
        if (currentUser) loadData(currentUser.id);
        alert('Đã chấp nhận yêu cầu mượn!');
    };

    const handleReject = (borrowId: string) => {
        if (confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) {
            updateBorrowStatus(borrowId, 'rejected');
            if (currentUser) loadData(currentUser.id);
            alert('Đã từ chối yêu cầu mượn!');
        }
    };

    const getStatusBadge = (status: BorrowRecord['status']) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            active: 'bg-blue-100 text-blue-800',
            returned: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800'
        };
        const labels = {
            pending: 'Chờ duyệt',
            active: 'Đang mượn',
            returned: 'Đã trả',
            rejected: 'Đã từ chối'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('vi-VN');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Quản lý mượn trả</h1>
                    <p className="text-gray-600">Theo dõi đồ chơi bạn đang mượn và yêu cầu mượn đồ của bạn</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('my-borrows')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'my-borrows'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Đồ tôi đang mượn ({myBorrows.filter(b => b.status === 'active').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'requests'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Yêu cầu mượn đồ của tôi ({requests.filter(r => r.status === 'pending').length})
                    </button>
                </div>

                {/* My Borrows Tab */}
                {activeTab === 'my-borrows' && (
                    <div className="space-y-4">
                        {myBorrows.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                                <div className="text-6xl mb-4">📦</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Chưa có đồ chơi nào đang mượn
                                </h3>
                                <p className="text-gray-600">
                                    Hãy đi tìm đồ chơi để mượn!
                                </p>
                            </div>
                        ) : (
                            myBorrows.map((borrow) => (
                                <div key={borrow.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="relative w-full md:w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={borrow.toyImageUrl}
                                                alt={borrow.toyName}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{borrow.toyName}</h3>
                                                    <p className="text-gray-600">Chủ sở hữu: {borrow.ownerName}</p>
                                                </div>
                                                {getStatusBadge(borrow.status)}
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm">
                                                    <span className="text-gray-500 w-40">Ngày mượn:</span>
                                                    <span className="font-medium text-gray-700">{formatDate(borrow.borrowDate)}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <span className="text-gray-500 w-40">Dự kiến trả:</span>
                                                    <span className="font-medium text-gray-700">{formatDate(borrow.expectedReturnDate)}</span>
                                                </div>
                                                {borrow.actualReturnDate && (
                                                    <div className="flex items-center text-sm">
                                                        <span className="text-gray-500 w-40">Ngày trả thực tế:</span>
                                                        <span className="font-medium text-gray-700">{formatDate(borrow.actualReturnDate)}</span>
                                                    </div>
                                                )}
                                                {borrow.notes && (
                                                    <div className="flex items-start text-sm">
                                                        <span className="text-gray-500 w-40">Ghi chú:</span>
                                                        <span className="font-medium text-gray-700">{borrow.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {borrow.status === 'active' && (
                                                <button
                                                    onClick={() => handleReturnToy(borrow.id)}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                                                >
                                                    Đánh dấu đã trả
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                                <div className="text-6xl mb-4">📭</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    Chưa có yêu cầu mượn nào
                                </h3>
                                <p className="text-gray-600">
                                    Các yêu cầu mượn đồ chơi của bạn sẽ hiển thị ở đây
                                </p>
                            </div>
                        ) : (
                            requests.map((request) => (
                                <div key={request.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="relative w-full md:w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={request.toyImageUrl}
                                                alt={request.toyName}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{request.toyName}</h3>
                                                    <p className="text-gray-600">Người mượn: {request.borrowerName}</p>
                                                </div>
                                                {getStatusBadge(request.status)}
                                            </div>
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm">
                                                    <span className="text-gray-500 w-40">Ngày yêu cầu:</span>
                                                    <span className="font-medium text-gray-700">{formatDate(request.borrowDate)}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <span className="text-gray-500 w-40">Dự kiến trả:</span>
                                                    <span className="font-medium text-gray-700">{formatDate(request.expectedReturnDate)}</span>
                                                </div>
                                                {request.notes && (
                                                    <div className="flex items-start text-sm">
                                                        <span className="text-gray-500 w-40">Ghi chú:</span>
                                                        <span className="font-medium text-gray-700">{request.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                            {request.status === 'pending' && (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                                                    >
                                                        Chấp nhận
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                                                    >
                                                        Từ chối
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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
