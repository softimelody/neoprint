import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center text-base font-semibold transition-all duration-300 ease-in-out focus:outline-none ' +
                (active
                    ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] '
                    : 'text-slate-400 hover:text-cyan-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}