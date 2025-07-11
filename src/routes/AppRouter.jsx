import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import FriendRequestsPage from '../pages/FriendRequestsPage';
import RegisterPage from '../pages/RegisterPage';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import ChatPage from '../pages/ChatPage';
import Dashboard from '../pages/Dashboard';
import ProfilePage from '../pages/ProfilePage';
import EditProfilePage from '../pages/EditProfilePage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:id/edit"
        element={
          <PrivateRoute>
            <EditProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/friends/requests"
        element={
          <PrivateRoute>
            <FriendRequestsPage />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
