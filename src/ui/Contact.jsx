import React, { useEffect, useRef, useState } from 'react';
import { CONTACT } from '../content.js';

const Icons = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5 5l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" />
    </svg>
  ),
};

function Magnetic({ as: Tag = 'button', className, label, href, children, onClick }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.35;
    const y = (e.clientY - r.top - r.height / 2) * 0.35;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  const props =
    Tag === 'a'
      ? { href }
      : { type: 'button', onClick };
  return (
    <Tag
      ref={ref}
      className={className}
      aria-label={label}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default function Contact() {
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (status !== 'busy') return;
    const a = setTimeout(() => setStatus('done'), 900);
    const b = setTimeout(() => setStatus('idle'), 3400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [status]);

  const handleCopyEmail = () => {
    if (status !== 'idle') return;
    setStatus('busy');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(CONTACT.email).catch(() => {});
    }
  };

  return (
    <div className="ct">
      <span className="mono dim">(07) Contact</span>
      <h2 className="ct-title">
        <span className="ln">
          <span>Let’s build</span>
        </span>
        <span className="ln">
          <span>
            something <em>solid.</em>
          </span>
        </span>
      </h2>
      <div className="ct-row">
        <div className="socials">
          <Magnetic
            as="a"
            href={`mailto:${CONTACT.email}`}
            className="soc"
            label={`Email ${CONTACT.email}`}
          >
            {Icons.mail}
          </Magnetic>
          <Magnetic
            as="a"
            href={CONTACT.phoneHref}
            className="soc"
            label={`Call ${CONTACT.phone}`}
          >
            {Icons.phone}
          </Magnetic>
          <Magnetic
            as="a"
            href={CONTACT.github}
            className="soc"
            label="GitHub Repository"
          >
            {Icons.github}
          </Magnetic>
          <div className="ct-meta">
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            <a href={CONTACT.phoneHref} className="mono dim">
              {CONTACT.phone} · {CONTACT.location}
            </a>
          </div>
        </div>
        <Magnetic
          className={`resume r-${status}`}
          label="Copy email address"
          onClick={handleCopyEmail}
        >
          <span className="resume-ic">{Icons.arrow}</span>
          <span className="resume-txt">
            {status === 'idle'
              ? 'Copy Email'
              : status === 'busy'
              ? 'Copying...'
              : 'Email Copied'}
          </span>
          <span className="resume-fill" />
        </Magnetic>
      </div>
      <footer className="foot">
        <span className="mono dim">© 2026 Devaharsh R · Pathanamthitta, Kerala</span>
        <span className="mono dim">Java · Web · OOP · DBMS</span>
      </footer>
    </div>
  );
}

