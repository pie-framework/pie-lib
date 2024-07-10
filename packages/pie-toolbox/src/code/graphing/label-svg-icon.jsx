import React from 'react';
import PropTypes from 'prop-types';

const SvgIcon = ({ type }) => {
  const icons = {
    correct: (
      <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M6.79688 0.306152C6.875 0.228027 7 0.228027 7.0625 0.306152L7.51562 0.743652C7.57812 0.821777 7.57812 0.946777 7.51562 1.00928L2.82812 5.69678C2.75 5.7749 2.64062 5.7749 2.5625 5.69678L0.46875 3.61865C0.40625 3.54053 0.40625 3.41553 0.46875 3.35303L0.921875 2.8999C0.984375 2.8374 1.10938 2.8374 1.1875 2.8999L2.6875 4.41553L6.79688 0.306152Z"
          fill="#0B7D38"
        />
      </svg>
    ),
    incorrect: (
      <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.23438 3.21045L5.92188 4.89795C6.01562 4.9917 6.01562 5.16357 5.92188 5.25732L5.53125 5.64795C5.4375 5.7417 5.26562 5.7417 5.17188 5.64795L3.5 3.96045L1.8125 5.64795C1.71875 5.7417 1.54688 5.7417 1.45312 5.64795L1.0625 5.25732C0.96875 5.16357 0.96875 4.9917 1.0625 4.89795L2.75 3.21045L1.0625 1.53857C0.96875 1.44482 0.96875 1.27295 1.0625 1.1792L1.45312 0.788574C1.54688 0.694824 1.71875 0.694824 1.8125 0.788574L3.5 2.47607L5.17188 0.788574C5.26562 0.694824 5.4375 0.694824 5.53125 0.788574L5.92188 1.1792C6.01562 1.27295 6.01562 1.44482 5.92188 1.53857L4.23438 3.21045Z"
          fill="#BF0D00"
        />
      </svg>
    ),
    empty: (
      <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0.25 4.13965V1.2334C0.25 0.928711 0.484375 0.670898 0.8125 0.670898H3.71875C3.85938 0.670898 4 0.811523 4 0.952148V1.51465C4 1.67871 3.85938 1.7959 3.71875 1.7959H1.375V4.13965C1.375 4.30371 1.23438 4.4209 1.09375 4.4209H0.53125C0.367188 4.4209 0.25 4.30371 0.25 4.13965ZM7 0.952148C7 0.811523 7.11719 0.670898 7.28125 0.670898H10.1875C10.4922 0.670898 10.75 0.928711 10.75 1.2334V4.13965C10.75 4.30371 10.6094 4.4209 10.4688 4.4209H9.90625C9.74219 4.4209 9.625 4.30371 9.625 4.13965V1.7959H7.28125C7.11719 1.7959 7 1.67871 7 1.51465V0.952148ZM10.4688 7.4209C10.6094 7.4209 10.75 7.56152 10.75 7.70215V10.6084C10.75 10.9365 10.4922 11.1709 10.1875 11.1709H7.28125C7.11719 11.1709 7 11.0537 7 10.8896V10.3271C7 10.1865 7.11719 10.0459 7.28125 10.0459H9.625V7.70215C9.625 7.56152 9.74219 7.4209 9.90625 7.4209H10.4688ZM4 10.8896C4 11.0537 3.85938 11.1709 3.71875 11.1709H0.8125C0.484375 11.1709 0.25 10.9365 0.25 10.6084V7.70215C0.25 7.56152 0.367188 7.4209 0.53125 7.4209H1.09375C1.23438 7.4209 1.375 7.56152 1.375 7.70215V10.0459H3.71875C3.85938 10.0459 4 10.1865 4 10.3271V10.8896Z"
          fill="#BF0D00"
        />
      </svg>
    ),
  };

  return icons[type] || null;
};

SvgIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default SvgIcon;