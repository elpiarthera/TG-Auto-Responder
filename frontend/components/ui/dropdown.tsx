import React, { useState, useRef, KeyboardEvent } from 'react';

interface DropdownProps {
  options: string[];
  onSelect: (option: string) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        setSelectedIndex((prevIndex) =>
          prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
        );
        event.preventDefault();
        break;
      case 'ArrowUp':
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        event.preventDefault();
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          onSelect(options[selectedIndex]);
          setIsOpen(false);
        }
        event.preventDefault();
        break;
      case 'Escape':
        setIsOpen(false);
        event.preventDefault();
        break;
    }
  };

  return (
    <div
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listbox"
      aria-expanded={isOpen}
    >
      <button onClick={() => setIsOpen(!isOpen)} aria-haspopup="listbox">
        Select an option
      </button>
      {isOpen && (
        <ul>
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};