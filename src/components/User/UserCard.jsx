import FriendButton from './FriendButton';

const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <strong>{user.username}</strong>
      <FriendButton userId={user.id} />
    </div>
  );
};
