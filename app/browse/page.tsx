'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ToyCard from '@/components/ToyCard';
import BorrowModal from '@/components/BorrowModal';
import { getAvailableToys, createBorrowRequest } from '@/lib/store';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { Toy, User } from '@/types';

export default function BrowsePage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [toys, setToys] = useState<Toy[]>([]);
    const [selectedToy, setSelectedToy] = useState<Toy | undefined>(undefined);
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const user = getCurrentUser();

        if (!user) {
            router.push('/login');
            return;
        }

        setCurrentUser(user);
        setToys(getAvailableToys());
    }, [router]);

    if (!currentUser) return null;

    const handleBorrowRequest = (toy: Toy) => {
        setSelectedToy(toy);
        setIsBorrowModalOpen(true);
    };

    const handleConfirmBorrow = (expectedReturnDate: Date, notes: string) => {
        if (selectedToy) {
            createBorrowRequest({
                toyId: selectedToy.id,
                toyName: selectedToy.name,
                toyImageUrl: selectedToy.imageUrl,
                borrowerId: currentUser.id,
                borrowerName: currentUser.name,
                ownerId: selectedToy.ownerId,
                ownerName: selectedToy.ownerName,
                borrowDate: new Date(),
                expectedReturnDate,
                notes
            });
            setToys(getAvailableToys());
            alert('Yêu cầu mượn đã được gửi thành công!');
        }
    };

    const filteredToys = toys.filter(toy => {
        const matchesSearch = toy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            toy.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || toy.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...Array.from(new Set(toys.map(t => t.category)))];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Tìm đồ chơi</h1>
                    <p className="text-gray-600">Duyệt qua danh sách đồ chơi có sẵn để mượn</p>
                </div>

                {/* Search and Filter */}
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm theo tên hoặc mô tả..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="all">Tất cả danh mục</option>
                                {categories.filter(c => c !== 'all').map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {filteredToys.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Không tìm thấy đồ chơi
                        </h3>
                        <p className="text-gray-600">
                            Thử thay đổi bộ lọc hoặc tìm kiếm khác
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4 text-gray-600">
                            Tìm thấy {filteredToys.length} đồ chơi
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredToys.map((toy) => (
                                <ToyCard
                                    key={toy.id}
                                    toy={toy}
                                    onBorrow={handleBorrowRequest}
                                    showActions={true}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <BorrowModal
                isOpen={isBorrowModalOpen}
                onClose={() => {
                    setIsBorrowModalOpen(false);
                    setSelectedToy(undefined);
                }}
                onBorrow={handleConfirmBorrow}
                toy={selectedToy}
            />
        </div>
    );
}
