import React from 'react';

export function Button({ children, variant, asChild, ...props }) {
  const className = variant === 'ghost' ? 'px-3 py-1 rounded text-sm' : 'px-3 py-1 rounded bg-primary text-white';
  if (asChild) {
    return React.cloneElement(children, { className: `${children.props.className ?? ''} ${className}`, ...props });
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}

export default Button;
