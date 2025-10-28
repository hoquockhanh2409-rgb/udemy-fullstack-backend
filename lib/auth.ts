import { User, AuthState } from '@/types';

// Storage keys
const USERS_STORAGE_KEY = 'toy_management_users';
const AUTH_STORAGE_KEY = 'toy_management_auth';

// Default users
const defaultUsers: User[] = [
    {
        id: 'admin-1',
        name: 'Admin Nguyễn',
        email: 'admin@toymanagement.com',
        password: 'admin123',
        role: 'admin',
        phone: '0901234567',
        address: 'Hà Nội',
        createdAt: new Date('2024-01-01')
    },
    {
        id: 'employee-1',
        name: 'Nhân viên Trần',
        email: 'employee@toymanagement.com',
        password: 'employee123',
        role: 'employee',
        phone: '0902345678',
        address: 'TP.HCM',
        createdAt: new Date('2024-01-15')
    },
    {
        id: 'user-1',
        name: 'Nguyễn Văn A',
        email: 'user1@example.com',
        password: 'user123',
        role: 'customer',
        phone: '0903456789',
        address: 'Đà Nẵng',
        createdAt: new Date('2024-02-01')
    },
    {
        id: 'user-2',
        name: 'Trần Thị B',
        email: 'user2@example.com',
        password: 'user123',
        role: 'customer',
        phone: '0904567890',
        address: 'Hải Phòng',
        createdAt: new Date('2024-02-05')
    },
    {
        id: 'user-3',
        name: 'Lê Văn C',
        email: 'user3@example.com',
        password: 'user123',
        role: 'customer',
        phone: '0905678901',
        address: 'Cần Thơ',
        createdAt: new Date('2024-02-10')
    }
];

// Helper functions for localStorage
const isBrowser = typeof window !== 'undefined';

const loadUsers = (): User[] => {
    if (!isBrowser) return defaultUsers;

    try {
        const stored = localStorage.getItem(USERS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Convert date strings back to Date objects
            return parsed.map((u: any) => ({
                ...u,
                createdAt: new Date(u.createdAt)
            }));
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }

    // Initialize with default users
    saveUsers(defaultUsers);
    return defaultUsers;
};

const saveUsers = (users: User[]): void => {
    if (!isBrowser) return;

    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error('Error saving users:', error);
    }
};

const loadAuthState = (): AuthState => {
    if (!isBrowser) return { user: null, isAuthenticated: false };

    try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.user) {
                return {
                    user: {
                        ...parsed.user,
                        createdAt: new Date(parsed.user.createdAt)
                    },
                    isAuthenticated: true
                };
            }
        }
    } catch (error) {
        console.error('Error loading auth state:', error);
    }

    return { user: null, isAuthenticated: false };
};

const saveAuthState = (state: AuthState): void => {
    if (!isBrowser) return;

    try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving auth state:', error);
    }
};

// Initialize
let users: User[] = loadUsers();
let authState: AuthState = loadAuthState();

// Auth operations
export const login = (email: string, password: string): User | null => {
    users = loadUsers(); // Reload users to get latest
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        authState = {
            user: user,
            isAuthenticated: true
        };
        saveAuthState(authState);
        return user;
    }
    return null;
};

export const register = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    users = loadUsers(); // Reload users

    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
        throw new Error('Email đã được sử dụng!');
    }

    const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        role: 'customer', // Default role
        createdAt: new Date()
    };
    users.push(newUser);
    saveUsers(users); // Save to localStorage

    // Auto login after register
    authState = {
        user: newUser,
        isAuthenticated: true
    };
    saveAuthState(authState);

    return newUser;
};

export const logout = (): void => {
    authState = {
        user: null,
        isAuthenticated: false
    };
    saveAuthState(authState);
};

export const getCurrentUser = (): User | null => {
    authState = loadAuthState(); // Reload from storage
    return authState.user;
};

export const isAuthenticated = (): boolean => {
    authState = loadAuthState(); // Reload from storage
    return authState.isAuthenticated;
};

export const hasRole = (role: User['role']): boolean => {
    return authState.user?.role === role;
};

export const isAdmin = (): boolean => {
    return authState.user?.role === 'admin';
};

export const isEmployee = (): boolean => {
    return authState.user?.role === 'employee';
};

export const isCustomer = (): boolean => {
    return authState.user?.role === 'customer';
};

// User management (Admin only)
export const getAllUsers = (): User[] => {
    if (!isAdmin()) return [];
    users = loadUsers(); // Reload users
    return users.map(({ password, ...user }) => user as User);
};

export const getUserById = (id: string): User | undefined => {
    users = loadUsers(); // Reload users
    return users.find(u => u.id === id);
};

export const updateUser = (id: string, userData: Partial<User>): User | null => {
    users = loadUsers(); // Reload users
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = {
        ...users[index],
        ...userData
    };
    saveUsers(users); // Save changes

    // Update authState if current user is updated
    if (authState.user?.id === id) {
        authState.user = users[index];
        saveAuthState(authState);
    }

    return users[index];
};

export const deleteUser = (id: string): boolean => {
    if (!isAdmin()) return false;

    users = loadUsers(); // Reload users
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    saveUsers(users); // Save changes;
    return true;
};
