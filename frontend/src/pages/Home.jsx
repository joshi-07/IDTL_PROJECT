import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import NoticeList from '../components/NoticeList';
import { io } from 'socket.io-client';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/notices');
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading notices...</p>
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">College Notice Board</h1>
          <p className="text-gray-600">Stay updated with the latest announcements and notices</p>
        </div>
        <NoticeList notices={notices} />
      </div>
    </div>
  );
};

export default Home;
