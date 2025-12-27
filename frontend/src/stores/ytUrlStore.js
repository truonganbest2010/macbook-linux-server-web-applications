import { defineStore } from 'pinia'
import api from '../services/api'

export const useYtUrlStore = defineStore('ytUrls', {
  state: () => ({
    ytUrls: [],
    totalCount: 0,
    loading: false,
    error: null,
    currentPage: 1,
    perPage: 9  // 3x3 grid
  }),

  actions: {
    async fetchYtUrls(page = 1, limit = 9) {
      this.loading = true
      this.currentPage = page
      this.perPage = limit
      
      const skip = (page - 1) * limit
      
      try {
        const response = await api.get(`/yt-urls?skip=${skip}&limit=${limit}`)
        this.ytUrls = response.data || []
        
        // Get total count
        const countResponse = await api.get('/yt-urls?limit=1000')
        this.totalCount = countResponse.data.length
        
        this.error = null
      } catch (err) {
        this.error = 'Failed to fetch YouTube URLs'
        this.ytUrls = []
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async addYtUrl(ytUrl) {
      try {
        const response = await api.post('/yt-urls', ytUrl)
        await this.fetchYtUrls(this.currentPage, this.perPage)
        return response.data
      } catch (err) {
        this.error = 'Failed to add YouTube URL'
        throw err
      }
    },

    async updateYtUrl(id, updates) {
      try {
        const response = await api.put(`/yt-urls/${id}`, updates)
        const index = this.ytUrls.findIndex(u => u.id === id)
        if (index !== -1) {
          this.ytUrls[index] = response.data
        }
        return response.data
      } catch (err) {
        this.error = 'Failed to update YouTube URL'
        throw err
      }
    },

    async deleteYtUrl(id) {
      try {
        await api.delete(`/yt-urls/${id}`)
        await this.fetchYtUrls(this.currentPage, this.perPage)
      } catch (err) {
        this.error = 'Failed to delete YouTube URL'
        throw err
      }
    }
  }
})