'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ToyCard from '@/components/ToyCard';
import ToyFormModal from '@/components/ToyFormModal';
import { getMyToys, createToy, updateToy, deleteToy } from '@/lib/store';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { Toy, User } from '@/types';

export default function MyToysPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [toys, setToys] = useState<Toy[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingToy, setEditingToy] = useState<Toy | undefined>(undefined);

    useEffect(() => {
        const user = getCurrentUser();

        if (!user) {
            router.push('/login');
            return;
        }

        setCurrentUser(user);
        setToys(getMyToys(user.id));
    }, [router]);

    if (!currentUser) return null;

    const handleAddToy = () => {
        setEditingToy(undefined);
        setIsModalOpen(true);
    };

    const handleEditToy = (toy: Toy) => {
        setEditingToy(toy);
        setIsModalOpen(true);
    };

    const handleSaveToy = (toyData: Omit<Toy, 'id' | 'createdAt' | 'updatedAt'>) => {
        if (editingToy) {
            updateToy(editingToy.id, toyData);
        } else {
            createToy({
                ...toyData,
                ownerId: currentUser.id,
                ownerName: currentUser.name
            });
        }
        setToys(getMyToys(currentUser.id));
        setIsModalOpen(false);
        setEditingToy(undefined);
    };

    const handleDeleteToy = (id: string) => {
        if (confirm('Bạn có chắc chắn muốn xóa đồ chơi này?')) {
            deleteToy(id);
            setToys(getMyToys(currentUser.id));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">Đồ chơi của tôi</h1>
                        <p className="text-gray-600">Quản lý danh sách đồ chơi bạn có thể cho mượn</p>
                    </div>
                    <button
                        onClick={handleAddToy}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        + Thêm đồ chơi
                    </button>
                </div>

                {toys.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                        <div className="text-6xl mb-4">🧸</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            Chưa có đồ chơi nào
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Hãy thêm đồ chơi đầu tiên của bạn để bắt đầu chia sẻ!
                        </p>
                        <button
                            onClick={handleAddToy}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                            Thêm đồ chơi đầu tiên
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {toys.map((toy) => (
                            <ToyCard
                                key={toy.id}
                                toy={toy}
                                onEdit={handleEditToy}
                                onDelete={handleDeleteToy}
                                showActions={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ToyFormModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingToy(undefined);
                }}
                onSave={handleSaveToy}
                toy={editingToy}
            />
        </div>
    );
}
