import React from 'react';

import './Footer.scss';

const Footer = () => (
  <div className="Footer">
    <span className="FooterText">
      Map created by{' '}
      <a
        href="https://github.com/Virian"
        className="FooterLink"
        target="_blank"
        rel="noreferrer"
      >
        Virian
      </a>
    </span>
  </div>
);

export default Footer;
