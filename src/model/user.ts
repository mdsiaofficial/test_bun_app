export interface User {
  id: number;
  name: string;
  email?: string;
}

export class UserModel {
  private static users: User[] = [
    { id: 1, name: "Ashiq", email: "ashiq@example.com" },
    { id: 2, name: "Bun User", email: "bun@example.com" },
  ];

  static getAllUsers(): User[] {
    return this.users;
  }

  static getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  static addUser(user: Omit<User, 'id'>): User {
    const newId = Math.max(...this.users.map(u => u.id)) + 1;
    const newUser: User = { id: newId, ...user };
    this.users.push(newUser);
    return newUser;
  }
}