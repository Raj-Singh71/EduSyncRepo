import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const getAllCourses = () =>
  axios.get(`${apiUrl}/courses`);

export const enrollInCourse = (userId, courseId, token) =>
  axios.post(`${apiUrl}/enrollments`, { userId, courseId }, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getEnrolledCourses = (userId, token) =>
  axios.get(`${apiUrl}/enrollments/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getInstructorCourses = (instructorId, token) =>
  axios.get(`${apiUrl}/courses/instructor/${instructorId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const editCourse = (id, data, token) =>
  axios.put(`${apiUrl}/courses/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteCourse = (id, token) =>
  axios.delete(`${apiUrl}/courses/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
