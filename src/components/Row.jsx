import { useEffect, useRef, useState } from 'react';
import { annotate, annotationGroup } from 'rough-notation';

const Row = ({ label, children }) => {
  const [hovered, setHovered] = useState(false);
  const rowRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!hovered) return;

    const box = annotate(rowRef.current, {
      type: 'box',
      color: '#34d399',
      animationDuration: 800,
    });
    const circle = annotate(labelRef.current, {
      type: 'circle',
      color: '#34d399',
      animationDuration: 300,
    });

    annotationGroup([box, circle]).show();

    return () => {
      box.remove();
      circle.remove();
    };
  }, [hovered]);

  return (
    <div
      ref={rowRef}
      className="-mx-4 mt-3 -mb-3 flex gap-25 px-4 py-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="w-27.5 shrink-0 text-[#8a8a8a]">
        <span ref={labelRef}>{label}</span>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Row;
