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

