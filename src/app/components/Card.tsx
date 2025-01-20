import React, { ReactNode } from 'react';

type CardProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

const Card: React.FC<CardProps> = ({ title, children, footer }) => {
  return (
    <div className="border rounded shadow-lg p-4 bg-white">
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <div className="mb-3">{children}</div>
      {footer && <div className="border-t mt-3 pt-3">{footer}</div>}
    </div>
  );
};

export default Card;
