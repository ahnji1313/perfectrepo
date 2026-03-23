```jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0 },
};

const ScrollAnimation = () => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 100], [0, 1]);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      variants={variants}
      style={{ opacity, x }}
    >
      <h1>Scroll Animation</h1>
    </motion.div>
  );
};

const Transition = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Transition</h1>
    </motion.div>
  );
};

const App = () => {
  return (
    <>
      <ScrollAnimation />
      <Transition />
    </>
  );
};

export default App;
```