/** @jsx h */

import { h } from 'preact';
import { useRef } from 'preact/hooks';
import { createPortal } from 'preact/compat';

import { getDefaultProps } from '../autocomplete-core/defaultProps';
import { getHTMLElement } from './getHTMLElement';
import { SearchBox } from './SearchBox';
import { Dropdown } from './Dropdown';

import {
  AutocompleteOptions,
  PublicAutocompleteOptions,
} from '../autocomplete-core/types/index';
import { useAutocomplete } from './useAutocomplete';
import { useDropdown } from './useDropdown';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

interface PublicRendererProps {
  /**
   * The container for the autocomplete dropdown.
   */
  dropdownContainer?: string | HTMLElement;
  /**
   * The dropdown placement related to the container.
   */
  dropdownPlacement?: 'start' | 'end';
  /**
   * The keyboard shortcuts keys to focus the input.
   */
  keyboardShortcuts?: string[];
}

export interface RendererProps extends Required<PublicRendererProps> {
  dropdownContainer: HTMLElement;
}

interface PublicProps<TItem>
  extends PublicAutocompleteOptions<TItem>,
    PublicRendererProps {}

export function getDefaultRendererProps<TItem>(
  rendererProps: PublicRendererProps,
  autocompleteProps: AutocompleteOptions<TItem>
): RendererProps {
  return {
    dropdownContainer: rendererProps.dropdownContainer
      ? getHTMLElement(
          rendererProps.dropdownContainer,
          autocompleteProps.environment
        )
      : autocompleteProps.environment.document.body,
    dropdownPlacement: rendererProps.dropdownPlacement ?? 'start',
    keyboardShortcuts: rendererProps.keyboardShortcuts ?? [],
  };
}

export function Autocomplete<TItem extends {}>(
  providedProps: PublicProps<TItem>
) {
  const {
    dropdownContainer,
    dropdownPlacement,
    keyboardShortcuts,
    ...autocompleteProps
  } = providedProps;
  const props = getDefaultProps(autocompleteProps);
  const rendererProps = getDefaultRendererProps(
    { dropdownContainer, dropdownPlacement, keyboardShortcuts },
    props
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBoxRef = useRef<HTMLFormElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [state, autocomplete] = useAutocomplete<TItem>(props);
  useDropdown<TItem>(rendererProps, state, searchBoxRef, dropdownRef);
  useKeyboardShortcuts<TItem>(rendererProps, props, inputRef);

  return (
    <div
      className={[
        'algolia-autocomplete',
        state.status === 'stalled' && 'algolia-autocomplete--stalled',
        state.status === 'error' && 'algolia-autocomplete--errored',
      ]
        .filter(Boolean)
        .join(' ')}
      {...autocomplete.getRootProps()}
    >
      <SearchBox
        searchBoxRef={searchBoxRef}
        inputRef={inputRef}
        placeholder={props.placeholder}
        query={state.query}
        isOpen={state.isOpen}
        status={state.status}
        getLabelProps={autocomplete.getLabelProps}
        getInputProps={autocomplete.getInputProps}
        completion={autocomplete.getCompletion()}
        {...autocomplete.getFormProps({
          inputElement: inputRef.current,
        })}
      />

      {createPortal(
        <Dropdown
          dropdownRef={dropdownRef}
          suggestions={state.suggestions}
          isOpen={state.isOpen}
          status={state.status}
          getItemProps={autocomplete.getItemProps}
          getMenuProps={autocomplete.getMenuProps}
        />,
        rendererProps.dropdownContainer
      )}
    </div>
  );
}
