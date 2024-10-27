"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";

import Link from "next/link";

const menuVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  closed: { opacity: 0, y: "-100%", transition: { duration: 0.5 } },
};

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lottieRef = useRef<Player>(null);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    if (lottieRef.current) {
      if (isMenuOpen) {
        lottieRef.current.setPlayerSpeed(1);
        lottieRef.current.play();
        document.body.classList.add("overflow-hidden");
      } else {
        lottieRef.current.setPlayerSpeed(-1);
        lottieRef.current.play();
        document.body.classList.remove("overflow-hidden");
      }
    }
  }, [isMenuOpen]);
  return (
    <>
      <div
        className="max-sm:block cursor-pointer z-[6000] hidden"
        onClick={toggleMenu}
      >
        <Player
          ref={lottieRef}
          autoplay={false}
          loop={false}
          src="/animations/menu.json"
          style={{ height: "40px", width: "40px" }}
          keepLastFrame
        />
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed z-[5000] top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <ul className="text-center text-lg space-y-10">
              <li>
                <Link href="/">MENU</Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Menu;
