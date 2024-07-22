import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

export const sendNotification = async (notification) => {
  try {
    const response = await axios.post(`${API_URL}/notifications`, notification);
    return response.data;
  } catch (error) {
    console.error('Error sending notification', error);
    throw error;
  }
};