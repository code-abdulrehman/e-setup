// src/stores/useTasksStore.js
import axiosInstance from '@/lib/api/axiosInstance';
import { showToast } from '@/utils/toast';
import { defineStore } from 'pinia';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [],
    currentTask: null,
    loading: false,
  }),
  actions: {
    async createTask(taskData) {
      this.loading = true;
      try {
        const response = await axiosInstance.post('/tasks', taskData);
        this.tasks.push(response.data.task);
        showToast({ severity: 'success', summary: 'Task Created', detail: 'Task has been created successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Creating Task', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getTaskById(taskId) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/tasks/${taskId}`);
        this.currentTask = response.data.task;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Task', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async updateTask(taskId, updateData) {
      this.loading = true;
      try {
        const response = await axiosInstance.put(`/tasks/${taskId}`, updateData);
        const index = this.tasks.findIndex(task => task.id === taskId);
        if (index !== -1) {
          this.tasks[index] = response.data.task;
        }
        showToast({ severity: 'success', summary: 'Task Updated', detail: 'Task has been updated successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Updating Task', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async deleteTask(taskId) {
      this.loading = true;
      try {
        await axiosInstance.delete(`/tasks/${taskId}`);
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        showToast({ severity: 'success', summary: 'Task Deleted', detail: 'Task has been deleted successfully.', life: 3000 });
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Deleting Task', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },

    async getAllTasks() {
      this.loading = true;
      try {
        const response = await axiosInstance.get('/tasks');
        this.tasks = response.data.tasks;
      } catch (error) {
        showToast({ severity: 'error', summary: 'Error Fetching Tasks', detail: error.response?.data?.message || error.message, life: 3000 });
      } finally {
        this.loading = false;
      }
    },
  },
});
