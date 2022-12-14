import { JSX, h, Fragment } from 'preact';
import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { toSearchable } from 'src/utils';
import './select.scss';

export type SelectProps<T> = {
  value: T | undefined;
  options: T[] | undefined;
  render?: (t: T) => JSX.Element | string | undefined;
  mapToKey?: (t: T, i: number) => string;
  mapToText?: (t: T, i: number) => string;
  isError?: boolean;
  isDisabled?: boolean;
  className?: string;
  width?: number | string;
  height?: 'small' | 'medium' | 'large';
  onBlur?: () => void;
  onChange?: (t: T | undefined) => void;
  id?: string;
  label?: JSX.Element | string;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
};

const identityString = <T,>(a: T, i: number) => {
  if (typeof a !== 'object') {
    return String(a);
  }
  return String(i);
};

const Select = <T,>({
  id,
  value,
  isError,
  isDisabled,
  options,
  className,
  width = '100%',
  label,
  placeholder,
  height = 'small',
  onChange = () => null,
  onBlur = () => null,
  render = (a) => a as unknown as string,
  mapToKey = identityString,
  mapToText = identityString,
  searchable = false,
  clearable = true
}: SelectProps<T>): JSX.Element => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [willFocusInput, setWillFocusInput] = useState(false);

  const filteredOptions = useMemo(() => {
    const searchable = toSearchable(search);
    return options?.filter((o, i) => toSearchable(mapToText(o, i)).includes(searchable));
  }, [search, options, mapToText]);

  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<{ el: HTMLDivElement; key: string }[]>([]);

  const shouldDisable = isDisabled || !options || options.length === 0;

  const setSelectOpen = useCallback(
    ({ open, focusInput, focus: focusCurrent }: { open: boolean; focusInput: boolean; focus: boolean; }) => {
      if (shouldDisable) {
        return;
      }

      if (!open) {
        onBlur();
        setSearch('');
      }

      if (focusCurrent) {
        ref.current?.focus();
      }

      if (focusInput) {
        setWillFocusInput(true);
      }

      setDropdownOpen(open);
    },
    [onBlur, setDropdownOpen, setWillFocusInput, shouldDisable]
  );

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    if (shouldDisable) {
      setSelectOpen({ open: false, focus: false, focusInput: false });
      return;
    }
  }, [dropdownOpen, shouldDisable, value, options, setSelectOpen, mapToKey, mapToText]);

  useEffect(() => {
    // Only want to focus the defaults (first option / value) when the select initially opens, with no search.
    if (!dropdownOpen) {
      return;
    }

    if (willFocusInput) {
      searchRef.current?.focus();
      return;
    }

    if (value !== undefined && value !== null) {
      const valueEl = optionRefs.current?.find((ref, i) => ref.key === mapToKey(value, i))?.el;
      valueEl?.focus();
      valueEl?.scrollIntoView({ block: 'nearest' });
      return;
    }

    optionRefs.current?.[0]?.el?.focus();
  }, [dropdownOpen, willFocusInput, mapToKey, value]);

  const chooseOption = (option: T | undefined) => {
    if (shouldDisable) {
      return;
    }

    setSelectOpen({ open: false, focus: true, focusInput: false });
    onChange(option);
  };

  const clickOut = useCallback(
    (evt: MouseEvent) => {
      if (ref.current?.contains(evt.target as Node)) {
        return;
      }

      if (dropdownOpen) {
        setSelectOpen({ open: false, focus: false, focusInput: false });
      }
    },
    [setSelectOpen, dropdownOpen]
  );

  useEffect(() => {
    document.body.addEventListener('mousedown', clickOut);
    return () => {
      document.body.removeEventListener('mousedown', clickOut);
    };
  }, [clickOut]);

  const renderCurrent = (): JSX.Element | string | undefined => {
    if (!options || !value) {
      return placeholder ? (<span className="select-box--selected-text--placeholder">{placeholder}</span>) : undefined;
    }

    return render(value);
  };

  const selectKeydown = (event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (['Enter', ' ', 'Spacebar'].includes(event.key)) {
      event.preventDefault();
      setSelectOpen({ open: !dropdownOpen, focus: true, focusInput: false });
      return;
    }

    if (['Esc', 'Escape'].includes(event.key)) {
      event.preventDefault();
      setSelectOpen({ open: false, focus: true, focusInput: false });
      return;
    }

    if (['ArrowDown'].includes(event.key)) {
      event.preventDefault();

      if (!dropdownOpen) {
        setSelectOpen({ open: true, focus: true, focusInput: false });
        return;
      }

      const nextEl = document.activeElement === ref.current ? optionRefs.current?.[0]?.el : document.activeElement?.nextElementSibling;
      (nextEl as HTMLElement | undefined)?.focus();
      nextEl?.scrollIntoView({ block: 'nearest' });
      return;
    }

    if (['Tab'].includes(event.key) && dropdownOpen) {
      setSelectOpen({ open: false, focus: true, focusInput: false });
      return;
    }

    if (['ArrowUp'].includes(event.key)) {
      event.preventDefault();

      if (!dropdownOpen) {
        return;
      }

      if (document.activeElement === optionRefs.current?.[0]?.el) {
        setSelectOpen({ open: false, focus: true, focusInput: false });
        return;
      }

      const prevEl = document.activeElement?.previousElementSibling as HTMLElement | null | undefined;
      prevEl?.focus();
      prevEl?.scrollIntoView({ block: 'nearest' });
      return;
    }

    if (/^[A-Za-z0-9]$/.test(event.key) && searchable) {
      if (!dropdownOpen) {
        setSelectOpen({ open: true, focus: false, focusInput: true });
        setSearch(event.key)
        return;
      }
      searchRef.current?.focus();
      return;
    }
  };

  const optionKeydown = (o: T | undefined) => (event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (['Enter', ' ', 'Spacebar'].includes(event.key)) {
      chooseOption(o);
    }
  };

  return (
    <Fragment>
      {label && <label htmlFor={id}>{label}</label>}
      <div
        ref={ref}
        style={{ width: typeof width === 'string' ? width : `${width}px` }}
        className={`select ${isError ? 'error' : ''} ${isDisabled ? 'disabled' : ''} ${className ? className : ''} ${height}`}
        tabIndex={0}
        onClick={() => setSelectOpen({ open: !dropdownOpen, focus: true, focusInput: false })}
        onKeyDown={selectKeydown}
      >
        <div className="select-box">
          <span className="select-box--selected-text">{renderCurrent()}</span>
          <img className="select-box--caret" src="/assets/icons/caret_down.svg" />
        </div>
        {dropdownOpen && (
          <div className="select-dropdown"
            onClick={(e) => {
              e.preventDefault();
              e.stopImmediatePropagation();
            }}>
            {searchable && (<div className="select-search">
              <input
                placeholder='search...'
                value={search}
                ref={searchRef}
                onInput={(e) => {
                  setSearch((e.target as HTMLInputElement).value)
                }} />
            </div>)}
            <div className="scroll-wrapper">
              {clearable && (<div
                className='select-option clear'
                tabIndex={-1}
                onKeyDown={optionKeydown(undefined)}
                onClick={() => chooseOption(undefined)}>
                clear
              </div>)}
              {filteredOptions?.map((o: NonNullable<T>, i) =>
                <div
                  className={`select-option${value != undefined && mapToKey(value, i) === mapToKey(o, i) ? ' select-option--chosen' : ''}`}
                  tabIndex={-1}
                  ref={(ref) => (optionRefs.current[i] = { el: ref as HTMLDivElement, key: mapToKey(o, i) })}
                  key={o && mapToKey(o, i)}
                  onKeyDown={optionKeydown(o)}
                  onClick={() => chooseOption(o)}>
                  <span>{render(o)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Select;
