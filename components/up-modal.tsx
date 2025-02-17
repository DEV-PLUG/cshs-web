import { motion, Variants } from "framer-motion";
import Backdrop from "./backdrop";
import { useEffect } from "react";

const dropUp = {
  hidden: {
    transform: 'translateY(20px)',
    opacity: 0
  },
  visible: {
    transform: 'translateY(0px)',
    opacity: 1,
    transition: {
      duration: 0.15,
			ease: [0, 0.71, 0.2, 1.01]
    }
  },
  exit: {
    transform: 'translateY(20px)',
    opacity: 0,
    transition: {
      duration: 0.15,
			ease: [0, 0.71, 0.2, 1.01]
    }
  },
};

function UpModal({ handleClose, children }:{ handleClose?:()=>void, children:any }) {
  var animationVariants:Variants = dropUp;

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose && handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="fixed z-50 w-[100vw] h-[100vh] top-0 left-0">
        <Backdrop onClick={handleClose} backdropType={'transparent'}>
          <></>
        </Backdrop>
      </div>
      <motion.div
        className="z-50 relative"
        variants={animationVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </motion.div>
    </>
  );
};

export default UpModal;