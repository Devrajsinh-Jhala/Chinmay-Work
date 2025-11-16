
import React from 'react';

interface IconProps {
  className?: string;
}

export const ChevronLeftIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5 8.25 12l7.5-7.5"
    />
  </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m8.25 4.5 7.5 7.5-7.5 7.5"
    />
  </svg>
);

export const AdminPanelIcon: React.FC<IconProps> = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.007 1.11-.952l2.176.335a.5.5 0 0 1 .467.467l.336 2.176c.054.348.397.643.744.7zM3.94 9.594c.542.09.952.56 1.007 1.11l.335 2.176a.5.5 0 0 1-.467.467L3.04 13.84c-.349-.053-.644-.396-.7-.744L2 10.92a.5.5 0 0 1 .467-.467l2.176-.335zM13.84 3.04c.349.053.644.396.7.744l.335 2.176a.5.5 0 0 1-.467.467L12.23 7.16c-.542-.09-1.007-.56-1.11-.952L10.92 4a.5.5 0 0 1 .467-.467l2.176-.335z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.067 21.06a1.5 1.5 0 0 0-2.133 0l-.534.534a1.5 1.5 0 0 0 0 2.133l.534.534a1.5 1.5 0 0 0 2.133 0l.534-.534a1.5 1.5 0 0 0 0-2.133l-.534-.534zM4.933 9.933a1.5 1.5 0 0 0-2.133 0l-.534.534a1.5 1.5 0 0 0 0 2.133l.534.534a1.5 1.5 0 0 0 2.133 0l.534-.534a1.5 1.5 0 0 0 0-2.133l-.534-.534zm14.134 4.134a1.5 1.5 0 0 0 0-2.133l-.534-.534a1.5 1.5 0 0 0-2.133 0l-.534.534a1.5 1.5 0 0 0 0 2.133l.534.534a1.5 1.5 0 0 0 2.133 0z" />
    </svg>
);
