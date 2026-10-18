import Image from 'next/image';
import './UserProfile.scss';

const UserProfile = () => {
  return (
    <div className="user-profile">
      <Image
        className="user-profile__avatar"
        src="/avatar.jpg"
        alt="User avatar"
        width={96}
        height={96}
        loading="eager"
      />
      <button className="user-profile__settings" type="button" aria-label="Settings">
        ⚙
      </button>
    </div>
  );
};

export default UserProfile;
