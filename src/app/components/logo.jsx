import { Link } from 'react-router-dom';
import logoPanda from '../assets/logo-panda.jpg';

export default function Logo() {
  return (
    <Link to="/" className="no-underline">
      <div className="inline-flex items-center p-2 [perspective:2000px] [transform-style:preserve-3d]">
        <img
          src={logoPanda}
          alt="Promptfoo Logo"
          className="w-[25px] h-auto transition-all duration-[1000ms] ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"
        />
        <h1 className="ml-2 font-semibold text-black dark:text-white text-base tracking-wide font-inter transition-all duration-300 ease-in-out hover:text-transparent hover:bg-gradient-to-r from-red-500 via-yellow-300 to-purple-700 bg-[length:300%_300%] bg-clip-text animate-[rainbow_3s_ease_infinite]">
          Rakfort
        </h1>
      </div>
    </Link>
  );
}
