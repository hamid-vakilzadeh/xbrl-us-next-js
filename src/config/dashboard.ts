export const comboboxConfig = {
  maxDropdownHeight: '300px',
  triggerHeight: '40px', // Minimum height for the trigger button
  itemHeight: '32px', // Height for dropdown items
  chevronWidth: '20px', // Space reserved for chevron icon
  padding: {
    x: 2, // 8px in Tailwind
    y: 1.5 // 6px in Tailwind
  },
  transitions: {
    all: 'background-color 150ms ease, color 150ms ease, border-color 150ms ease'
  }
}

export const sidebarConfig = {
  defaultWidth: 300, // Increased default width to prevent content cramping
  minWidth: 280, // Minimum width that ensures combobox content is readable
  maxWidth: 600,
  resizeTransition: 'width 150ms ease-in-out',
  padding: {
    x: 4, // 16px in Tailwind
    y: 4
  }
}