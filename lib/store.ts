import { Toy, BorrowRecord } from '@/types';
import { getCurrentUser } from './auth';

// Storage keys
const TOYS_STORAGE_KEY = 'toy_management_toys';
const BORROWS_STORAGE_KEY = 'toy_management_borrows';

// Helper functions
const isBrowser = typeof window !== 'undefined';

const loadToys = (): Toy[] => {
    if (!isBrowser) return defaultToys;

    try {
        const stored = localStorage.getItem(TOYS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map((t: any) => ({
                ...t,
                createdAt: new Date(t.createdAt),
                updatedAt: new Date(t.updatedAt)
            }));
        }
    } catch (error) {
        console.error('Error loading toys:', error);
    }

    saveToys(defaultToys);
    return defaultToys;
};

const saveToys = (toys: Toy[]): void => {
    if (!isBrowser) return;
    try {
        localStorage.setItem(TOYS_STORAGE_KEY, JSON.stringify(toys));
        // Persist toys to server-side database.json (fire-and-forget)
        ;(async () => {
            try {
                await fetch('/api/db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ section: 'toys', data: toys })
                })
            } catch (err) {
                console.error('Failed to persist toys to server:', err)
            }
        })()
    } catch (error) {
        console.error('Error saving toys:', error);
    }
};

const loadBorrowRecords = (): BorrowRecord[] => {
    if (!isBrowser) return defaultBorrows;

    try {
        const stored = localStorage.getItem(BORROWS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.map((b: any) => ({
                ...b,
                borrowDate: new Date(b.borrowDate),
                expectedReturnDate: new Date(b.expectedReturnDate),
                actualReturnDate: b.actualReturnDate ? new Date(b.actualReturnDate) : undefined
            }));
        }
    } catch (error) {
        console.error('Error loading borrows:', error);
    }

    saveBorrowRecords(defaultBorrows);
    return defaultBorrows;
};

const saveBorrowRecords = (borrows: BorrowRecord[]): void => {
    if (!isBrowser) return;
    try {
        localStorage.setItem(BORROWS_STORAGE_KEY, JSON.stringify(borrows));
        // Persist borrows to server-side database.json (fire-and-forget)
        ;(async () => {
            try {
                await fetch('/api/db', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ section: 'borrows', data: borrows })
                })
            } catch (err) {
                console.error('Failed to persist borrows to server:', err)
            }
        })()
    } catch (error) {
        console.error('Error saving borrows:', error);
    }
};

// Default data
const defaultToys: Toy[] = [
    {
        id: 'toy-1',
        name: 'Xe ô tô điều khiển từ xa',
        description: 'Xe ô tô điều khiển từ xa với nhiều chức năng, pin sạc đầy đủ',
        category: 'Đồ chơi điện tử',
        ageRange: '5-10 tuổi',
        condition: 'Tốt',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        ownerId: 'user-1',
        ownerName: 'Nguyễn Văn A',
        available: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: 'toy-2',
        name: 'Búp bê Barbie',
        description: 'Búp bê Barbie với nhiều bộ trang phục đi kèm',
        category: 'Búp bê',
        ageRange: '3-8 tuổi',
        condition: 'Như mới',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        ownerId: 'user-2',
        ownerName: 'Trần Thị B',
        available: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01')
    },
    {
        id: 'toy-3',
        name: 'Bộ Lego City',
        description: 'Bộ lego xây dựng thành phố với hơn 500 chi tiết',
        category: 'Lego/Xếp hình',
        ageRange: '6-12 tuổi',
        condition: 'Tốt',
        imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        ownerId: 'user-1',
        ownerName: 'Nguyễn Văn A',
        available: false,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    }
];

const defaultBorrows: BorrowRecord[] = [
    {
        id: 'borrow-1',
        toyId: 'toy-3',
        toyName: 'Bộ Lego City',
        toyImageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
        borrowerId: 'user-3',
        borrowerName: 'Lê Văn C',
        ownerId: 'user-1',
        ownerName: 'Nguyễn Văn A',
        borrowDate: new Date('2024-03-01'),
        expectedReturnDate: new Date('2024-03-15'),
        status: 'active',
        notes: 'Sẽ trả đúng hạn'
    }
];

// Initialize
let toys: Toy[] = loadToys();
let borrowRecords: BorrowRecord[] = loadBorrowRecords();

// Toy operations
export const getToys = (): Toy[] => {
    toys = loadToys();
    return [...toys];
};

export const getMyToys = (userId: string): Toy[] => {
    toys = loadToys();
    return toys.filter((toy: Toy) => toy.ownerId === userId);
};

export const getAvailableToys = (): Toy[] => {
    toys = loadToys();
    const currentUser = getCurrentUser();
    if (!currentUser) return toys.filter((toy: Toy) => toy.available);
    return toys.filter((toy: Toy) => toy.available && toy.ownerId !== currentUser.id);
};

export const getToyById = (id: string): Toy | undefined => {
    toys = loadToys();
    return toys.find((toy: Toy) => toy.id === id);
};

export const createToy = (toyData: Omit<Toy, 'id' | 'createdAt' | 'updatedAt'>): Toy => {
    toys = loadToys();

    // Basic validations (library-level) to prevent invalid data when client-side is bypassed
    if (!toyData.name || !toyData.name.trim()) throw new Error('Tên đồ chơi là bắt buộc');
    if (!toyData.description || !toyData.description.trim()) throw new Error('Mô tả là bắt buộc');
    if (!toyData.category || !toyData.category.trim()) throw new Error('Danh mục là bắt buộc');
    if (!toyData.ageRange || !toyData.ageRange.trim()) throw new Error('Độ tuổi phù hợp là bắt buộc');
    try {
        // validate image URL format
        new URL(toyData.imageUrl);
    } catch (err) {
        throw new Error('URL hình ảnh không hợp lệ');
    }

    const newToy: Toy = {
        ...toyData,
        id: `toy-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    toys.push(newToy);
    saveToys(toys);
    return newToy;
};

export const updateToy = (id: string, toyData: Partial<Toy>): Toy | null => {
    toys = loadToys();
    const index = toys.findIndex((toy: Toy) => toy.id === id);
    if (index === -1) return null;

    toys[index] = {
        ...toys[index],
        ...toyData,
        updatedAt: new Date()
    };
    saveToys(toys);
    return toys[index];
};

export const deleteToy = (id: string): boolean => {
    toys = loadToys();
    const index = toys.findIndex((toy: Toy) => toy.id === id);
    if (index === -1) return false;

    toys.splice(index, 1);
    saveToys(toys);
    return true;
};

// Borrow operations
export const getBorrowRecords = (): BorrowRecord[] => {
    borrowRecords = loadBorrowRecords();
    return [...borrowRecords];
};

export const getMyBorrows = (userId: string): BorrowRecord[] => {
    borrowRecords = loadBorrowRecords();
    return borrowRecords.filter((record: BorrowRecord) => record.borrowerId === userId);
};

export const getBorrowsForMyToys = (userId: string): BorrowRecord[] => {
    borrowRecords = loadBorrowRecords();
    return borrowRecords.filter((record: BorrowRecord) => record.ownerId === userId);
};

export const createBorrowRequest = (borrowData: Omit<BorrowRecord, 'id' | 'status'>): BorrowRecord => {
    borrowRecords = loadBorrowRecords();
    // Validate borrow request at library level
    const toy = getToyById(borrowData.toyId);
    if (!toy) throw new Error('Đồ chơi không tồn tại');
    if (!toy.available) throw new Error('Đồ chơi hiện không khả dụng');
    if (borrowData.borrowerId === toy.ownerId) throw new Error('Người mượn không thể là chủ sở hữu');
    const borrowDate = new Date(borrowData.borrowDate);
    const expected = new Date(borrowData.expectedReturnDate);
    if (isNaN(borrowDate.getTime()) || isNaN(expected.getTime())) throw new Error('Ngày mượn hoặc ngày trả không hợp lệ');
    if (expected <= borrowDate) throw new Error('Ngày dự kiến trả phải sau ngày mượn');

    const newBorrow: BorrowRecord = {
        ...borrowData,
        id: `borrow-${Date.now()}`,
        status: 'pending'
    };
    borrowRecords.push(newBorrow);
    saveBorrowRecords(borrowRecords);

    // Update toy availability
    updateToy(toy.id, { available: false });

    return newBorrow;
};

export const updateBorrowStatus = (id: string, status: BorrowRecord['status']): BorrowRecord | null => {
    borrowRecords = loadBorrowRecords();
    const index = borrowRecords.findIndex((record: BorrowRecord) => record.id === id);
    if (index === -1) return null;

    borrowRecords[index].status = status;

    // If returned, update actualReturnDate and toy availability
    if (status === 'returned') {
        borrowRecords[index].actualReturnDate = new Date();
        const toy = getToyById(borrowRecords[index].toyId);
        if (toy) {
            updateToy(toy.id, { available: true });
        }
    }

    // If rejected, make toy available again
    if (status === 'rejected') {
        const toy = getToyById(borrowRecords[index].toyId);
        if (toy) {
            updateToy(toy.id, { available: true });
        }
    }

    saveBorrowRecords(borrowRecords);
    return borrowRecords[index];
};
