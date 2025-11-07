import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminPanel from '../components/AdminPanel';
import NoticeList from '../components/NoticeList';
import api from '../services/api';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingNotice, setEditingNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin-login');
      return;
    }

    fetchNotices();

    // Connect to Socket.io for realtime updates
    const socket = io('http://localhost:5000');

    socket.on('notice:created', (newNotice) => {
      setNotices(prev => [newNotice, ...prev]);
    });

    socket.on('notice:updated', (updatedNotice) => {
      setNotices(prev => prev.map(notice =>
        notice._id === updatedNotice._id ? updatedNotice : notice
      ));
    });

    socket.on('notice:deleted', (deletedId) => {
      setNotices(prev => prev.filter(notice => notice._id !== deletedId));
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  const fetchNotices = async () => {
    try {
      const response = await api.get('/notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin-login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNoticeAdded = () => {
    fetchNotices();
  };

  const handleNoticeUpdated = () => {
    fetchNotices();
    setEditingNotice(null);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      try {
        await api.delete(`/notices/${id}`);
        setNotices(prev => prev.filter(notice => notice._id !== id));
      } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Error deleting notice. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage college notices and announcements</p>
        </div>

        <AdminPanel
          onNoticeAdded={handleNoticeAdded}
          onNoticeUpdated={handleNoticeUpdated}
          editingNotice={editingNotice}
          setEditingNotice={setEditingNotice}
        />

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">All Notices</h2>
          <NoticeList
            notices={notices}
            isAdmin={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
