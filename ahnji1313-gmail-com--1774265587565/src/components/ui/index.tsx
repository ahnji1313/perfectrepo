```typescript
// Button.tsx
import React from 'react';
import { tw } from 'twind';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  children,
  disabled,
  onClick,
}) => {
  const className = tw(
    'px-4 py-2 font-bold rounded',
    {
      'bg-blue-500 text-white hover:bg-blue-700': variant === 'primary',
      'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
      'bg-red-500 text-white hover:bg-red-700': variant === 'danger',
    },
    { 'opacity-50 pointer-events-none': disabled }
  );

  return (
    <button
      aria-disabled={disabled}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
```

```typescript
// Input.tsx
import React from 'react';
import { tw } from 'twind';

interface InputProps {
  type: 'text' | 'email' | 'password';
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  ariaLabel: string;
}

const Input: React.FC<InputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  ariaLabel,
}) => {
  const className = tw`px-4 py-2 border border-gray-300 rounded`;

  return (
    <input
      aria-label={ariaLabel}
      className={className}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default Input;
```

```typescript
// Modal.tsx
import React from 'react';
import { tw } from 'twind';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  const overlayClassName = tw`fixed top-0 left-0 w-full h-full bg-black bg-opacity-50`;
  const modalClassName = tw`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded`;

  return (
    <div aria-hidden={!isOpen} className={overlayClassName}>
      <div
        aria-label={title}
        aria-modal="true"
        className={modalClassName}
        role="dialog"
      >
        <header className={tw`px-4 py-2 border-b border-gray-300`}>
          <h2 className={tw`font-bold`}>{title}</h2>
          <button
            aria-label="Close"
            className={tw`px-4 py-2 font-bold rounded`}
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <div className={tw`px-4 py-2`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
```

```typescript
// Toast.tsx
import React from 'react';
import { tw } from 'twind';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const className = tw`fixed bottom-4 right-4 bg-gray-200 px-4 py-2 rounded`;

  return (
    <div aria-live="assertive" aria-atomic="true" className={className}>
      <span>{message}</span>
      <button
        aria-label="Close"
        className={tw`px-4 py-2 font-bold rounded`}
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default Toast;
```

```typescript
// Card.tsx
import React from 'react';
import { tw } from 'twind';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  const className = tw`bg-white px-4 py-2 rounded shadow`;

  return <div className={className}>{children}</div>;
};

export default Card;
```

```typescript
// Badge.tsx
import React from 'react';
import { tw } from 'twind';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'danger';
}

const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  const className = tw(
    'px-2 py-1 font-bold rounded',
    {
      'bg-blue-500 text-white': variant === 'primary',
      'bg-gray-200 text-gray-800': variant === 'secondary',
      'bg-red-500 text-white': variant === 'danger',
    }
  );

  return <span className={className}>{children}</span>;
};

export default Badge;
```

```typescript
// Avatar.tsx
import React from 'react';
import { tw } from 'twind';

interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  const className = tw`w-8 h-8 rounded-full`;

  return <img alt={alt} className={className} src={src} />;
};

export default Avatar;
```

```typescript
// Dropdown.tsx
import React from 'react';
import { tw } from 'twind';

interface DropdownProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({ children, trigger }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={tw`px-4 py-2 font-bold rounded`}
        onClick={handleToggle}
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          aria-hidden={!isOpen}
          aria-labelledby="dropdown-label"
          className={tw`absolute bg-white px-4 py-2 rounded shadow`}
          role="menu"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
```

```typescript
// Table.tsx
import React from 'react';
import { tw } from 'twind';

interface TableProps {
  children: React.ReactNode;
}

const Table: React.FC<TableProps> = ({ children }) => {
  const className = tw`w-full table-auto border border-gray-300`;

  return (
    <table className={className}>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
```

```typescript
// Spinner.tsx
import React from 'react';
import { tw } from 'twind';

interface SpinnerProps {
  size: 'small' | 'large';
}

const Spinner: React.FC<SpinnerProps> = ({ size }) => {
  const className = tw(
    'animate-spin',
    {
      'w-4 h-4 border-2 border-gray-200 border-t-gray-600': size === 'small',
      'w-8 h-8 border-4 border-gray-200 border-t-gray-600': size === 'large',
    }
  );

  return <div className={className} />;
};

export default Spinner;
```

```typescript
// Skeleton.tsx
import React from 'react';
import { tw } from 'twind';

interface SkeletonProps {
  width: string;
  height: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height }) => {
  const className = tw`bg-gray-200 animate-pulse`;

  return <div className={className} style={{ width, height }} />;
};

export default Skeleton;
```