import {
  AutocompleteApi,
  AutocompleteState,
} from '@francoischalifour/autocomplete-core';
import React, { MutableRefObject } from 'react';

import { MAX_QUERY_SIZE } from './constants';
import { LoadingIcon } from './icons/LoadingIcon';
import { ResetIcon } from './icons/ResetIcon';
import { SearchIcon } from './icons/SearchIcon';
import { InternalDocSearchHit } from './types';

interface SearchBoxProps
  extends AutocompleteApi<
    InternalDocSearchHit,
    React.FormEvent,
    React.MouseEvent,
    React.KeyboardEvent
  > {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: MutableRefObject<HTMLInputElement | null>;
  onClose(): void;
  showDropdown(): void;
  hideDropdown(): void;
  IsDropdownShown: boolean;
}

export function SearchBox(props: SearchBoxProps) {
  const { onReset } = props.getFormProps({
    inputElement: props.inputRef.current,
  });

  React.useEffect(() => {
    if (props.autoFocus && props.inputRef.current) {
      props.inputRef.current.focus();
      props.showDropdown();
    } else {
      props.hideDropdown();
      props.inputRef.current.blur();
    }
  }, [props.autoFocus, props.inputRef]);

  return (
    <>
      <form
        action=""
        role="search"
        noValidate
        className={`DocSearch-Form ${!props.IsDropdownShown ? 'forward-slash' : ''}`}
        onSubmit={(event) => {
          event.preventDefault();
        }}
        onReset={onReset}
        onClick={props.showDropdown}
        onBlur={props.hideDropdown}
      >
        <label className="DocSearch-MagnifierLabel" {...props.getLabelProps()}>
          <SearchIcon />
        </label>

        <div className="DocSearch-LoadingIndicator">
          <LoadingIcon />
        </div>

        <input
          className="DocSearch-Input"
          ref={props.inputRef}
          {...props.getInputProps({
            inputElement: props.inputRef.current!,
            autoFocus: props.autoFocus,
            maxLength: MAX_QUERY_SIZE,
            enterkeyhint: 'go',
          })}
        />

        <button
          type="reset"
          title="Clear the query"
          className="DocSearch-Reset"
          hidden={!props.state.query}
          onClick={onReset}
        >
          <ResetIcon />
        </button>
      </form>

      <button className="DocSearch-Cancel" onClick={props.onClose}>
        Cancel
      </button>
    </>
  );
}
