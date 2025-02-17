import { motion } from "framer-motion";

export default function Backdrop({ children, onClick, backdropType }:{ children:any, onClick:any, backdropType:'black' | 'transparent' }) {
  return (
    <motion.div
      className={ backdropType === 'black' ? "bg-black/20 fixed top-0 bottom-0 left-0 right-0 z-40" : "bg-black/0 fixed top-0 bottom-0 left-0 right-0 z-40" }
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
};