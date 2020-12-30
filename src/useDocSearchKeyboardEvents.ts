import React from 'react';

export interface UseDocSearchKeyboardEventsProps {
  isOpen: boolean;
  onOpen(): void;
  onClose(): void;
  onFocus(): void;
  onNotFocus(): void;
  onInput?(event: KeyboardEvent): void;
  searchButtonRef?: React.RefObject<HTMLButtonElement>;
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement;
  const tagName = element.tagName;

  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  );
}

export function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
  onFocus,
  onNotFocus,
  onInput,
  searchButtonRef,
}: UseDocSearchKeyboardEventsProps) {
  React.useEffect(() => {

    onNotFocus(); // Reset focus
    
    function onKeyDown(event: KeyboardEvent) {
      
      function open() {
        // We check that no other DocSearch modal is showing before opening
        // another one.
        if (!document.body.classList.contains('DocSearch--active')) {
          onOpen();
        }
      }

      if((!isEditingContent(event) && event.key === '/')) {
        onNotFocus();
        onFocus();
        event.preventDefault();
      } else if (event.target.className === 'DocSearch-Input' || event.target.id === 'docsearch-input') {
        onFocus();
      } else {
        onNotFocus();
      }

      if (
        (event.keyCode === 27 && isOpen) ||
        // The `Cmd+K` shortcut both opens and closes the modal.
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) ||
        // The `/` shortcut opens but doesn't close the modal because it's
        // a character.
        (!isEditingContent(event) && event.key === '/' && !isOpen)
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
          onNotFocus();
        } else if (!document.body.classList.contains('DocSearch--active')) {
          open();
        }
      }

      if (
        searchButtonRef &&
        searchButtonRef.current === document.activeElement &&
        onInput
      ) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpen, onClose, onInput, searchButtonRef]);
}
