export interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

export const TABLE_DEMO_USERS: UserRow[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: new Date(2024, 0, 5)
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: new Date(2024, 1, 12)
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'Editor',
    status: 'pending',
    createdAt: new Date(2024, 2, 20)
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    role: 'User',
    status: 'active',
    createdAt: new Date(2024, 3, 3)
  },
  {
    id: 5,
    name: 'Charlie Green',
    email: 'charlie@example.com',
    role: 'Moderator',
    status: 'active',
    createdAt: new Date(2024, 3, 15)
  },
  {
    id: 6,
    name: 'Diana Prince',
    email: 'diana@example.com',
    role: 'Admin',
    status: 'inactive',
    createdAt: new Date(2024, 4, 1)
  },
  {
    id: 7,
    name: 'Edward King',
    email: 'edward@example.com',
    role: 'User',
    status: 'pending',
    createdAt: new Date(2024, 4, 20)
  },
  {
    id: 8,
    name: 'Fiona White',
    email: 'fiona@example.com',
    role: 'Editor',
    status: 'active',
    createdAt: new Date(2024, 5, 8)
  },
  {
    id: 9,
    name: 'George Black',
    email: 'george@example.com',
    role: 'User',
    status: 'inactive',
    createdAt: new Date(2024, 5, 30)
  },
  {
    id: 10,
    name: 'Hannah Gray',
    email: 'hannah@example.com',
    role: 'Admin',
    status: 'active',
    createdAt: new Date(2024, 6, 10)
  },
  {
    id: 11,
    name: 'Ian Blue',
    email: 'ian@example.com',
    role: 'User',
    status: 'pending',
    createdAt: new Date(2024, 6, 22)
  },
  {
    id: 12,
    name: 'Julia Silver',
    email: 'julia@example.com',
    role: 'Moderator',
    status: 'active',
    createdAt: new Date(2024, 7, 5)
  },
  {
    id: 13,
    name: 'Kevin Gold',
    email: 'kevin@example.com',
    role: 'Editor',
    status: 'inactive',
    createdAt: new Date(2024, 7, 18)
  },
  {
    id: 14,
    name: 'Laura Violet',
    email: 'laura@example.com',
    role: 'User',
    status: 'active',
    createdAt: new Date(2024, 8, 1)
  },
  {
    id: 15,
    name: 'Michael Orange',
    email: 'michael@example.com',
    role: 'User',
    status: 'pending',
    createdAt: new Date(2024, 8, 15)
  }
];


