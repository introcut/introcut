import type { User } from "../auth/session";

/** The person's Google picture, or their initial if there is none (or it can't load). */
export function Avatar({ user, size = 32 }: { user: User; size?: number }) {
  const initial = (user.name.trim()[0] ?? "?").toUpperCase();
  return user.picture ? (
    <img className="avatar" src={user.picture} alt="" width={size} height={size} referrerPolicy="no-referrer" />
  ) : (
    <span className="avatar initial" style={{ width: size, height: size, fontSize: size * 0.45 }} aria-hidden="true">
      {initial}
    </span>
  );
}
