/** @jsx h */

import { h } from 'preact';

interface DropdownProps {
  suggestions: any;
  status: string;
  getItemProps(options?: object): any;
  getMenuProps(options?: object): any;
}

export const Dropdown = ({
  status,
  suggestions,
  getItemProps,
  getMenuProps,
}: DropdownProps) => {
  return (
    <div
      className={[
        'algolia-autocomplete-dropdown',
        status === 'stalled' && 'algolia-autocomplete-dropdown--stalled',
        status === 'error' && 'algolia-autocomplete-dropdown--errored',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="algolia-autocomplete-dropdown-container">
        {suggestions.map((suggestion, index) => {
          const { source, items } = suggestion;

          return (
            <section
              key={`result-${index}`}
              className="algolia-autocomplete-suggestions"
            >
              {items.length > 0 && (
                <ul {...getMenuProps()}>
                  {items.map((item, index) => {
                    return (
                      <li
                        key={`item-${index}`}
                        className="algolia-autocomplete-suggestions-item"
                        {...getItemProps({
                          item,
                          tabIndex: 0,
                        })}
                      >
                        {item.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
