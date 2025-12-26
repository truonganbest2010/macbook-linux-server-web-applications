import { defineStore } from 'pinia';
import api from '../services/api';

export const useYtUrlStore = defineStore(
    'ytUrls',
    {
        state: () => ({
            ytUrls: [],
            loading: false,
            error: null,
        }),
        actions: {
            async fetchYtUrls() {
                this.loading = true;
                try {
                    const response = await api.get('/yt-urls');
                    this.ytUrls = response.data;
                    this.error = null;
                } catch (error) {
                    this.error('Error fetching URLs');
                    console.error(error);
                } finally {
                    this.loading = false;
                }
            },

            async addYtUrl(ytUrl) {
                try {
                    const response = await api.post('/yt-urls', ytUrl);
                    this.ytUrls.push(response.data);
                    return response.data;
                } catch (error) {
                    this.error('Error adding URL');
                    throw error;
                }
            },

            async deleteYtUrl(id) {
                try {
                    await api.delete(`/yt-urls/${id}`);
                    this.ytUrls = this.ytUrls.filter(url => url.id !== id);
                } catch (error) {
                    this.error('Error deleting URL');
                    throw error;
                }
            },

            async updateYtUrl(id, updatedYtUrl) {
                try {
                    const response = await api.put(`/yt-urls/${id}`, updatedYtUrl);
                    const index = this.ytUrls.findIndex(url => url.id === id);
                    if (index !== -1) {
                        this.ytUrls[index] = response.data;
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