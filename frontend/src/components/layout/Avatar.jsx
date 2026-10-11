import { useAuth } from '../../context/AuthContext';

export default function Avatar({ size = 32, className = '' }) {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'U';

  const style = {
    width: size,
    height: size,
    fontSize: size * 0.38,
  };

  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        style={style}
        className={`rounded-full object-cover ring-1 ring-white/10 ${className}`}
      />
    );
  }

  return (
    <div
      style={style}
      className={`rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-white ring-1 ring-white/10 ${className}`}
    >
      {initials}
    </div>
  );
}