export default function Avatar({ user, size = 36 }) {
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="avatar" style={{ width: size, height: size, background: user?.avatarColor || '#2563eb' }}>
      {initials || 'U'}
    </span>
  );
}

