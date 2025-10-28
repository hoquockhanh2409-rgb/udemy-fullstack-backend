import { Toy } from '@/types';
import { useState, useEffect } from 'react';

interface ToyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (toy: Omit<Toy, 'id' | 'createdAt' | 'updatedAt'>) => void;
    toy?: Toy;
}

export default function ToyFormModal({ isOpen, onClose, onSave, toy }: ToyFormModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        ageRange: '',
        condition: 'Tốt' as Toy['condition'],
        imageUrl: '',
        ownerId: '',
        ownerName: '',
        available: true
    });

    useEffect(() => {
        if (toy) {
            setFormData({
                name: toy.name,
                description: toy.description,
                category: toy.category,
                ageRange: toy.ageRange,
                condition: toy.condition,
                imageUrl: toy.imageUrl,
                ownerId: toy.ownerId,
                ownerName: toy.ownerName,
                available: toy.available
            });
        }
    }, [toy]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
                    <h2 className="text-2xl font-bold">
                        {toy ? 'Chỉnh sửa đồ chơi' : 'Thêm đồ chơi mới'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tên đồ chơi *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                            placeholder="Ví dụ: Xe ô tô điều khiển từ xa"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả *
                        </label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                            placeholder="Mô tả chi tiết về đồ chơi"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Danh mục *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                            >
                                <option value="">Chọn danh mục</option>
                                <option value="Đồ chơi điện tử">Đồ chơi điện tử</option>
                                <option value="Búp bê">Búp bê</option>
                                <option value="Lego/Xếp hình">Lego/Xếp hình</option>
                                <option value="Xe đồ chơi">Xe đồ chơi</option>
                                <option value="Đồ chơi giáo dục">Đồ chơi giáo dục</option>
                                <option value="Đồ chơi ngoài trời">Đồ chơi ngoài trời</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Độ tuổi phù hợp *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.ageRange}
                                onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                                placeholder="Ví dụ: 3-8 tuổi"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tình trạng *
                        </label>
                        <select
                            required
                            value={formData.condition}
                            onChange={(e) => setFormData({ ...formData, condition: e.target.value as Toy['condition'] })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        >
                            <option value="Như mới">Như mới</option>
                            <option value="Tốt">Tốt</option>
                            <option value="Khá">Khá</option>
                            <option value="Trung bình">Trung bình</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL hình ảnh *
                        </label>
                        <input
                            type="url"
                            required
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-semibold"
                        >
                            {toy ? 'Cập nhật' : 'Thêm đồ chơi'}
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
