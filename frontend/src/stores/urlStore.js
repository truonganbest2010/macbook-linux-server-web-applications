import { defineStore } from 'pinia';
import api from '../services/api';

export const useUrlStore = defineStore(
    'urls',
    {
        state: () => ({
            urls: [],
            loading: false,
            error: null,
        }),
        actions: {
            async fetchUrls() {
                this.loading = true;
                try {
                    const response = await api.get('/urls');
                    this.urls = response.data;
                    this.error = null;
                } catch (error) {
                    this.error('Error fetching URLs');
                    console.error(error);
                } finally {
                    this.loading = false;
                }
            },
            
            async addUrl(url) {
                try {
                    const response = await api.post('/urls', url);
                    this.urls.push(response.data);
                    return response.data;
                } catch (error) {
                    this.error('Error adding URL');
                    throw error;
                }
            },

            async deleteUrl(id) {
                try {
                    await api.delete(`/urls/${id}`);
                    this.urls = this.urls.filter(url => url.id !== id);
                } catch (error) {
                    this.error('Error deleting URL');
                    throw error;
                }
            },

            async updateUrl(id, updatedUrl) {
                try {
                    const response = await api.put(`/urls/${id}`, updatedUrl);
                    const index = this.urls.findIndex(url => url.id === id);
                    if (index !== -1) {
                        this.urls[index] = response.data;
                    }
                    return response.data;
                } catch (error) {
                    this.error('Error updating URL');
                    throw error;
                }
            },
        },
    }
);