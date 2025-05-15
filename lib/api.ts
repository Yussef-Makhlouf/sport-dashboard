import { API_URL } from "./constants";
import { getAuthHeaders } from "@/components/login-form";

export const addUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_URL}/auth/addUser`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const updateUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_URL}/auth/update`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};