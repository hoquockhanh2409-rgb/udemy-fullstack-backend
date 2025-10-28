export interface Toy {
    id: string;
    name: string;
    description: string;
    category: string;
    ageRange: string;
    condition: 'Như mới' | 'Tốt' | 'Khá' | 'Trung bình';
    imageUrl: string;
    ownerId: string;
    ownerName: string;
    available: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface BorrowRecord {
    id: string;
    toyId: string;
    toyName: string;
    toyImageUrl: string;
    borrowerId: string;
    borrowerName: string;
    ownerId: string;
    ownerName: string;
    borrowDate: Date;
    expectedReturnDate: Date;
    actualReturnDate?: Date;
    status: 'pending' | 'active' | 'returned' | 'rejected';
    notes?: string;
}

export type UserRole = 'admin' | 'employee' | 'customer';

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    address?: string;
    createdAt: Date;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}
