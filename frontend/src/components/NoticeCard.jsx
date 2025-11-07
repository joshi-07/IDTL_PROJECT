import { useState } from 'react';

const NoticeCard = ({ notice, isAdmin = false, onEdit, onDelete }) => {
  const [showFull, setShowFull] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDownload = (attachment) => {
    window.open(`http://localhost:5000/uploads/${attachment}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{notice.title}</h3>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
              {notice.department}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
              {notice.type}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{formatDate(notice.date)}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(notice)}
              className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(notice._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="text-gray-700 mb-4">
        {showFull ? notice.description : `${notice.description.substring(0, 200)}...`}
        {notice.description.length > 200 && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-blue-600 hover:text-blue-800 ml-1"
          >
            {showFull ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {notice.attachments && notice.attachments.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Attachments:</h4>
          <div className="flex flex-wrap gap-2">
            {notice.attachments.map((attachment, index) => (
              <button
                key={index}
                onClick={() => handleDownload(attachment)}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm"
              >
                📎 {attachment}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeCard;
