import axios from 'axios';
import { BaseUrl } from '../Componentes/BaseUrl/base';

const API_URL = `${BaseUrl}/users`;

export const userAPI = {
  /**
   * Update user profile data
   * @param {Object} data - User data to update
   * @returns {Promise}
   */
  async updateUserData(data) {
    try {
      const response = await axios.put(`${API_URL}/updateUserData`, data);
      
      if (response.data.msg === 'User updated successfully') {
        return {
          success: true,
          token: response.data.token,
          user: response.data.user
        };
      }
      
      throw new Error('Update failed');
    } catch (error) {
      console.error('Update Error:', error);
      throw error;
    }
  },

  /**
   * Change user password
   * @param {Object} data - Password data
   * @returns {Promise}
   */
  async changePassword(data) {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/changeMyPassword`, data, {
        headers: {
          token: token
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Change Password Error:', error);
      throw error;
    }
  },

  /**
   * Get user profile
   * @returns {Promise}
   */
  async getUserProfile() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/profile`, {
        headers: {
          token: token
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Get Profile Error:', error);
      throw error;
    }
  }
};