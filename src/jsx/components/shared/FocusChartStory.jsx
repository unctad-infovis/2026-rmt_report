import { useEffect, useRef, useState } from 'react';

import './FocusChartStory.css';

const FocusChartStory = ({ label, stages, renderChart, className = '' }) => {
  const [activeStep, setActiveStep] = useState(0);
  const panelRefs = useRef([]);

  useEffect(() => {
    let frame = null;
    let resizeTimer;
    const updateStep = () => {
      frame = null;
      const trigger = window.innerHeight * 0.55;
      let next = 0;
      let nearestDistance = Infinity;
      for (const [index, panel] of panelRefs.current.entries()) {
        if (!panel) continue;
        const card = panel.firstElementChild.getBoundingClientRect();
        const distance = Math.abs(card.top + card.height / 2 - trigger);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          next = index;
        }
      }
      setActiveStep(next);
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(updateStep);
    };
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(onScroll, 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    const observer = new ResizeObserver(onScroll);
    const article = panelRefs.current[0]?.closest('.app');
    if (article) observer.observe(article);
    for (const panel of panelRefs.current) {
      if (panel) observer.observe(panel);
    }
    updateStep();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <section className={`focus_story ${className}`} aria-label={label} data-active-step={stages[activeStep].key}>
      <div className="focus_story_layout">
        <div className="focus_story_visual">{renderChart(activeStep)}</div>
        <div className="focus_story_panels">
          {stages.map((stage, index) => (
            <div
              className="focus_story_panel"
              key={stage.key}
              data-step={stage.key}
              ref={node => {
                panelRefs.current[index] = node;
              }}
            >
              <div className="focus_story_text">
                <p className="focus_story_step">
                  {index + 1} / {stages.length}
                </p>
                <h3 className="focus_story_headline">{stage.headline}</h3>
                {stage.body && <p>{stage.body}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FocusChartStory;
