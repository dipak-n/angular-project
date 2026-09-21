import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-component.html',
  styleUrls: ['./user-component.scss']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading: boolean = false;

  // Modal Control State
  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  currentUser: User = { name: '', email: '', role: 'Member' };

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data: any[]) => {
        // Limiting to 6 items for a clean UI demo
        this.users = data.slice(0, 6).map((u: any) => ({ ...u, role: 'Member' }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading users', err);
        this.isLoading = false;
      }
    });
  }

  // Open modal for adding a new user
  openAddModal() {
    this.isEditMode = false;
    this.currentUser = { name: '', email: '', role: 'Member' };
    this.isModalOpen = true;
  }

  // Open modal for editing an existing user
  openEditModal(user: any) {
    this.isEditMode = true;
    this.currentUser = { ...user }; // Clone object to prevent mutation before save
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // Save (Create or Update)
  saveUser() {
    if (!this.currentUser.name.trim() || !this.currentUser.email.trim()) return;
    if (this.isEditMode && this.currentUser.id) {
      this.userService.updateUser(this.currentUser.id, this.currentUser).subscribe({
        next: () => {
          const index = this.users.findIndex(u => u.id === this.currentUser.id);
          if (index !== -1) {
            this.users[index] = { ...this.currentUser };
          }
          this.closeModal();
          setTimeout(() => {
            this.closeModal();
          }, 100);
        },
        error: (err: any) => console.error('Failed to update user', err)
      });
    } else {
      this.userService.addUser(this.currentUser).subscribe({
        next: (newUser: any) => {
          newUser.id = newUser.id || Date.now(); // Fallback ID
          this.users.unshift(newUser);
          this.closeModal();
          setTimeout(() => {
            this.closeModal();
          }, 100);
        },
        error: (err: any) => console.error('Failed to add user', err)
      });
    }
  }

  deleteUser(id?: any) {
    if (!id) return;
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
        },
        error: (err: any) => console.error('Failed to delete user', err)
      });
    }
  }
}