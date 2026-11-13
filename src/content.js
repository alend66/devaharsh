export const GROUPS = {
  Languages: ['Java', 'Python', 'C', 'C++', 'JavaScript'],
  Web: ['HTML', 'CSS', 'PHP'],
  Databases: ['MySQL', 'PostgreSQL'],
  'Tools & OS': ['Git', 'GitHub', 'Linux', 'Windows', 'VS Code', 'Eclipse'],
  Core: ['OOP', 'DBMS', 'Web Dev'],
};

export const SKILLS = Object.entries(GROUPS).flatMap(([g, ws]) =>
  ws.map((w) => ({ w, g }))
);

export const PROJECTS = [
  {
    kicker: '(02) Solo Project',
    tag: 'Web · Full Stack',
    title: 'Tech Fest',
    em: 'System',
    desc: 'I built a solo web application for technical festivals featuring event registration, participant management, a responsive UI, a PHP backend, and a MySQL database.',
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
  },
  {
    kicker: '(02) Internship · Server Admin',
    tag: 'Linux · Cloud Ops',
    title: 'HashRoot',
    em: 'Servers',
    desc: 'Server Administrator intern working with Linux, AWS EC2, cPanel/WHM, Plesk, DNS, SSL certificates, website migration, backup, firewall rules, and email analysis.',
    stack: ['Linux', 'AWS EC2', 'cPanel/WHM', 'Plesk', 'DNS', 'SSL', 'Backup', 'Firewall'],
  },
  {
    kicker: '(02) Internship · Front-End',
    tag: 'UI · Fundamentals',
    title: 'PACELAB',
    em: 'Training',
    desc: 'Student Intern trained in front-end development using HTML, CSS, and JavaScript to build responsive website layouts and practical development workflows.',
    stack: ['HTML', 'CSS', 'JavaScript', 'Front-End Training'],
  },
];

export const STATS = [
  { label: 'OOP · Backend', title: 'Java', h: 3.8 },
  { label: 'HTML · CSS · JS · PHP', title: 'Web', h: 4.2 },
  { label: 'MySQL · PostgreSQL', title: 'DBMS', h: 3.6 },
  { label: 'Linux · AWS EC2 · DNS', title: 'Cloud', h: 4.8 },
];

export const JOURNEY = [
  {
    year: '2024',
    role: 'B.Tech in Computer Science & Engineering',
    place: 'College of Engineering Kallooppara',
    note: '2020 — 2024 · Pathanamthitta, Kerala',
  },
  {
    year: '2026',
    role: 'Server Administrator & Student Intern',
    place: 'HashRoot · PACELAB',
    note: 'Linux, AWS EC2, cPanel/WHM, Plesk, DNS, SSL · Front-end training',
  },
  {
    year: '2026',
    role: 'Java Full Stack Developer',
    place: 'QSpiders Certification',
    note: 'Java, OOP, DBMS, PHP & MySQL · Full Stack Development',
  },
];

export const CERTS = [
  ['QSpiders', 'Java Full Stack', 'CERTIFIED'],
  ['CE Kallooppara', 'B.Tech CSE 2020–24', 'DEGREE'],
  ['HashRoot', 'Server Administrator', 'INTERNSHIP'],
  ['PACELAB', 'Front-End Training', 'INTERNSHIP'],
  ['Solo Project', 'Tech Fest System', 'PHP · MYSQL'],
  ['Core Focus', 'OOP & DBMS', 'JAVA · WEB'],
];

export const CONTACT = {
  email: 'devaharsh14@gmail.com',
  phone: '+91 9447783643',
  phoneHref: 'tel:+919447783643',
  github: 'https://github.com/alend66/devaharsh',
  location: 'Pathanamthitta, Kerala',
};

