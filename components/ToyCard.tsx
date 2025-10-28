import { Toy } from '@/types';
import Image from 'next/image';

interface ToyCardProps {
    toy: Toy;
    onEdit?: (toy: Toy) => void;
    onDelete?: (id: string) => void;
    onBorrow?: (toy: Toy) => void;
    showActions?: boolean;
}

export default function ToyCard({ toy, onEdit, onDelete, onBorrow, showActions = true }: ToyCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100">
                <Image
                    src={toy.imageUrl}
                    alt={toy.name}
                    fill
                    className="object-cover"
                    unoptimized
                />
                {!toy.available && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Đang cho mượn
                    </div>
                )}
                {toy.available && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Có sẵn
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{toy.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{toy.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Danh mục:</span>
                        <span className="font-medium text-gray-700">{toy.category}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Độ tuổi:</span>
                        <span className="font-medium text-gray-700">{toy.ageRange}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Tình trạng:</span>
                        <span className="font-medium text-gray-700">{toy.condition}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-gray-500 w-24">Chủ sở hữu:</span>
                        <span className="font-medium text-purple-600">{toy.ownerName}</span>
                    </div>
                </div>

                {showActions && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(toy)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Sửa
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(toy.id)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Xóa
                            </button>
                        )}
                        {onBorrow && toy.available && (
                            <button
                                onClick={() => onBorrow(toy)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                                Mượn
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
