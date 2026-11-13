import React, { useEffect, useRef, useState } from 'react';
import { store, clamp } from '../store.js';
import { vis, phase, centerU } from '../timeline.js';
import { scrollToU } from '../lib/scroll.js';
import { GROUPS, SKILLS, PROJECTS, STATS, JOURNEY } from '../content.js';
import Contact from './Contact.jsx';

function Words({ text, base = 0 }) {
  return text.split(' ').map((w, i) => {
    const em = w.startsWith('*');
    const t = w.replace(/\*/g, '');
    return (
      <React.Fragment key={i}>
        <span className="wd">
          <span
            className={`wd-in ${em ? 'em' : ''}`}
            style={{ transitionDelay: `${base + i * 0.035}s` }}
          >
            {t}
          </span>
        </span>{' '}
      </React.Fragment>
    );
  });
}

function Count({ to, decimals = 0, on }) {
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    if (!on || done.current) return;
    done.current = true;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (now) => {
      const k = clamp((now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 4);
      if (ref.current) ref.current.textContent = (to * e).toFixed(decimals);
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [on, to, decimals]);
  return <span ref={ref}>{(0).toFixed(decimals)}</span>;
}

function Nav({ show }) {
  const tl = store.tl;
  const [touring, setTouring] = useState(false);
  const [recording, setRecording] = useState(false);
  const recRef = useRef(null);

  useEffect(() => {
    if (!touring) return;
    let raf;
    let last = performance.now();
    const stopOnInput = () => setTouring(false);
    window.addEventListener('wheel', stopOnInput, { passive: true });
    window.addEventListener('touchstart', stopOnInput, { passive: true });

    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const nextU = Math.min(1, store.target + dt * 0.038);
      store.target = nextU;
      if (max > 0) window.scrollTo(0, nextU * max);
      if (nextU < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setTouring(false);
        if (recRef.current && recRef.current.state === 'recording') {
          recRef.current.stop();
        }
      }
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', stopOnInput);
      window.removeEventListener('touchstart', stopOnInput);
    };
  }, [touring]);

  const toggleTour = () => {
    if (!touring && store.target >= 0.97) {
      store.target = 0;
      store.off = 0;
      window.scrollTo(0, 0);
    }
    setTouring((v) => !v);
  };

  const toggleRecordVideo = () => {
    if (recording) {
      if (recRef.current && recRef.current.state === 'recording') {
        recRef.current.stop();
      }
      setTouring(false);
      return;
    }
    const canvas = document.querySelector('.stage canvas');
    if (!canvas || !canvas.captureStream || typeof MediaRecorder === 'undefined') return;
    if (store.target >= 0.95) {
      store.target = 0;
      store.off = 0;
      window.scrollTo(0, 0);
    }
    const stream = canvas.captureStream(60);
    const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';
    const recorder = new MediaRecorder(stream, {
      mimeType: mime,
      videoBitsPerSecond: 12000000,
    });
    const chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      setRecording(false);
      const blob = new Blob(chunks, { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'devaharsh-portfolio-2026.webm';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };
    recRef.current = recorder;
    recorder.start();
    setRecording(true);
    setTouring(true);
  };

  const go = (id) => {
    setTouring(false);
    scrollToU(centerU(tl, tl.index[id]));
  };
  return (
    <nav className={`nav ${show ? 'show' : ''}`} aria-label="Section navigation">
      <button type="button" className="nav-mark" onClick={() => { setTouring(false); scrollToU(0); }}>
        D<span>.</span>
      </button>
      <div className="nav-links">
        <button
          type="button"
          className={`nav-tour ${touring ? 'on' : ''}`}
          onClick={toggleTour}
          aria-label={touring ? 'Pause cinematic tour' : 'Play cinematic tour'}
        >
          <span className="tour-dot" />
          <span>{touring ? 'Pause' : 'Play Tour'}</span>
        </button>
        <button
          type="button"
          className={`nav-tour ${recording ? 'on' : ''}`}
          onClick={toggleRecordVideo}
          aria-label={recording ? 'Stop and save video' : 'Record 60fps portfolio video'}
        >
          <span className="tour-dot" />
          <span>{recording ? 'Save Video' : 'Record Video'}</span>
        </button>
        {[
          ['about', 'About'],
          ['work0', 'Work'],
          ['skills', 'Skills'],
          ['journey0', 'Journey'],
          ['contact', 'Contact'],
        ].map(([id, label]) => (
          <button type="button" key={id} className="nav-link" onClick={() => go(id)}>
            <span className="nav-roll" data-text={label}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function Overlay({ ready }) {
  const tl = store.tl;
  const I = tl.index;
  const panels = useRef([]);
  const [onSet, setOnSet] = useState({});
  const [group, setGroup] = useState(null);
  const onRef = useRef({});

  useEffect(() => {
    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const u = store.off;
      let changed = false;
      panels.current.forEach((el) => {
        if (!el) return;
        const i = Number(el.dataset.shot);
        const fade = Number(el.dataset.fade || 0.3);
        let v = vis(tl, u, i, fade);
        if (i === 0 && !store.introDone) v = 0;
        const ph = phase(tl, u, i, fade);
        el.style.opacity = v.toFixed(3);
        el.style.visibility = v < 0.003 ? 'hidden' : 'visible';
        el.style.transform = `translate3d(0, ${(-ph * 60).toFixed(1)}px, 0)`;
        el.style.pointerEvents = v > 0.6 ? 'auto' : 'none';
        const key = el.dataset.key;
        const on = v > 0.55;
        if (onRef.current[key] !== on) {
          onRef.current[key] = on;
          el.classList.toggle('on', on);
          changed = true;
        }
      });
      if (changed) setOnSet({ ...onRef.current });
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [tl]);

  const reg = (el) => el && !panels.current.includes(el) && panels.current.push(el);
  const P = (key, shot, className, children, fade) => (
    <section
      ref={reg}
      data-shot={shot}
      data-key={key}
      data-fade={fade}
      className={`pnl ${className}`}
    >
      {children}
    </section>
  );

  const pickGroup = (g) => {
    store.skillGroup = g;
    setGroup(g);
  };

  return (
    <div className={`overlay ${ready ? 'ready' : ''}`}>
      {/* HERO */}
      {P(
        'hero',
        I.hero,
        'pnl-hero',
        <>
          <div className="hm-col">
            <span className="mono dim">Devaharsh R</span>
            <span>Full Stack Developer</span>
          </div>
          <div className="hm-col right">
            <span className="mono dim">Java · Web · OOP · DBMS</span>
            <span>Kerala, India — 2026</span>
          </div>
        </>,
        0.25
      )}

      {/* ABOUT */}
      {P(
        'about',
        I.about,
        'pnl-about',
        <>
          <span className="mono dim kicker">(01) — Summary</span>
          <p className="lead">
            <Words text="I’m a recent B.Tech CSE *graduate* skilled in Java, web development, OOP and *DBMS* — building with HTML, CSS, JavaScript, PHP and *MySQL.*" />
          </p>
          <div className="stats">
            <div>
              <b>
                <Count to={16} on={onSet.about} />
              </b>
              <span className="mono dim">Skills &amp; Tools</span>
            </div>
            <div>
              <b>
                0<Count to={2} on={onSet.about} />
              </b>
              <span className="mono dim">Internships</span>
            </div>
            <div>
              <b>
                0<Count to={1} on={onSet.about} />
              </b>
              <span className="mono dim">Solo Web App</span>
            </div>
          </div>
        </>
      )}

      {/* WORK / EXPERIENCE MONOLITHS */}
      {PROJECTS.map((p, i) =>
        P(
          `work${i}`,
          I[`work${i}`],
          `pnl-work ${tl.shots[I[`work${i}`]].pos.x > 0 ? 'side-right' : 'side-left'}`,
          <div className="work-card">
            <div className="wc-top mono dim">
              <span>{p.kicker}</span>
              <span>
                0{i + 1} / 0{PROJECTS.length}
              </span>
            </div>
            <span className="mono dim wc-tag">{p.tag}</span>
            <h3 className="wc-title">
              <Words text={`${p.title} *${p.em}*`} />
            </h3>
            <p className="wc-desc">{p.desc}</p>
            <ul className="chips">
              {p.stack.map((s, k) => (
                <li key={s} style={{ transitionDelay: `${0.25 + k * 0.05}s` }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )
      )}

      {/* SKILLS */}
      {P(
        'skills',
        I.skills,
        'pnl-skills',
        <>
          <div className="sk-head">
            <span className="mono dim">(03)</span>
            <h2 className="big">
              <Words text="The *Toolkit*" />
            </h2>
          </div>
          <ul className="groups" onMouseLeave={() => pickGroup(null)}>
            {Object.entries(GROUPS).map(([g], i) => (
              <li key={g} style={{ transitionDelay: `${0.15 + i * 0.06}s` }}>
                <button
                  type="button"
                  className={`group ${group === g ? 'on' : ''}`}
                  onMouseEnter={() => pickGroup(g)}
                  onClick={() => pickGroup(group === g ? null : g)}
                >
                  <span className="mono dim gi">0{i + 1}</span>
                  <span className="gname">{g}</span>
                </button>
              </li>
            ))}
          </ul>
        </>,
        0.4
      )}

      <div className="labels">
        {SKILLS.map((s, i) => (
          <span
            key={s.w}
            className="sk-label"
            ref={(el) => (store.labels.skills[i] = el)}
          >
            {s.w}
          </span>
        ))}
        {STATS.map((s, i) => (
          <span
            key={s.label}
            className="tw-label"
            ref={(el) => (store.labels.towers[i] = el)}
          >
            <span className="tw-val">{s.title}</span>
            <span className="mono dim">{s.label}</span>
          </span>
        ))}
      </div>

      {/* CORE PILLARS */}
      {P(
        'numbers',
        I.numbers,
        'pnl-numbers',
        <>
          <div className="nb-head">
            <span className="mono dim">(04)</span>
            <h2 className="big">
              <Words text="Core *Pillars*" />
            </h2>
          </div>
          <div className="honors">
            <div>
              <span className="hn-star">✦</span>
              <span className="hn-big">B.Tech CSE</span>
              <span className="mono dim">College of Engineering Kallooppara (2020–2024)</span>
            </div>
            <div>
              <span className="hn-star">✦</span>
              <span className="hn-big">Java Full Stack</span>
              <span className="mono dim">QSpiders Certification</span>
            </div>
          </div>
        </>,
        0.4
      )}

      {/* JOURNEY */}
      {JOURNEY.map((j, i) =>
        P(
          `journey${i}`,
          I[`journey${i}`],
          'pnl-journey',
          <>
            <span className="mono dim">(05) The Journey — 0{i + 1}</span>
            <div className="jy-year">
              {j.year.split('').map((c, k) => (
                <span key={k} className="jy-d">
                  <span style={{ transitionDelay: `${k * 0.06}s` }}>{c}</span>
                </span>
              ))}
            </div>
            <div className="jy-role">{j.role}</div>
            <div className="jy-place">{j.place}</div>
            <div className="mono dim jy-note">{j.note}</div>
          </>
        )
      )}

      {/* CERTS */}
      {P(
        'certs',
        I.certs,
        'pnl-certs',
        <>
          <span className="mono dim">(06) Credentials &amp; Training</span>
          <h2 className="big">
            <Words text="Verified *Foundation*" />
          </h2>
        </>,
        0.4
      )}

      {/* CONTACT */}
      {P('contact', I.contact, 'pnl-contact', <Contact />, 0.4)}

      <Nav show={ready} />
    </div>
  );
}

