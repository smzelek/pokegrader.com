import { JSX, h, Fragment } from 'preact';
import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import './select.scss';

export type SelectProps<T> = {
  value: T | null;
  options: T[] | undefined;
  render?: (t: T) => JSX.Element | string | undefined;
  mapToKey?: (t: NonNullable<T>, i: number) => string;
  mapToText?: (t: NonNullable<T>, i: number) => string;
  isError?: boolean;
  isDisabled?: boolean;
  className?: string;
  width?: number | string;
  height?: 'small' | 'medium' | 'large';
  onBlur?: () => void;
  onChange?: (t: T | null) => void;
  id?: string;
  label?: JSX.Element | string;
  placeholder?: string;
  clearable?: boolean;
  errorText?: string;
  helpText?: string;
  action?: JSX.Element | string;
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
  clearable = false,
  errorText = '',
  helpText = '',
}: SelectProps<T>): JSX.Element => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toMatch, setToMatch] = useState<string>('');
  const ref = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<{ el: HTMLDivElement; key: string }[]>([]);

  const shouldDisable = isDisabled || !options || options.length === 0;

  const setSelectOpen = useCallback(
    ({ open, focus }: { open: boolean; focus: boolean }) => {
      if (shouldDisable) {
        return;
      }

      setDropdownOpen(open);
      if (!open) {
        onBlur();
        setToMatch('');
      }

      if (focus) {
        ref.current?.focus();
      }
    },
    [onBlur, setDropdownOpen, shouldDisable]
  );

  const findMatch = useCallback(() => {
    const matchIndex = (options || []).findIndex((o, i) => o && mapToText(o, i).toLowerCase().startsWith(toMatch));
    return optionRefs.current?.[matchIndex]?.el;
  }, [options, toMatch, mapToText]);

  useEffect(() => {
    if (!dropdownOpen) {
      return;
    }

    if (shouldDisable) {
      setSelectOpen({ open: false, focus: false });
      return;
    }

    if (options && toMatch.length) {
      const matchEl = findMatch();
      matchEl?.focus();
      matchEl?.scrollIntoView({ block: 'nearest' });
      return;
    }
  }, [dropdownOpen, shouldDisable, toMatch, value, options, findMatch, setSelectOpen, mapToKey, mapToText]);

  useEffect(() => {
    // Only want to focus the defaults (first option / value) when the select initially opens, with no search.
    if (!dropdownOpen) {
      return;
    }

    const matchEl = findMatch();
    if (toMatch.length && matchEl) {
      return;
    }

    if (value) {
      const valueEl = optionRefs.current?.find((ref, i) => ref.key === mapToKey(value, i))?.el;
      valueEl?.focus();
      valueEl?.scrollIntoView({ block: 'nearest' });
      return;
    }

    optionRefs.current?.[0]?.el?.focus();
  }, [dropdownOpen, findMatch, mapToKey, toMatch.length, value]);

  const chooseOption = (option: T) => {
    if (shouldDisable) {
      return;
    }

    setSelectOpen({ open: false, focus: true });
    onChange(option);
  };

  const clickOut = useCallback(
    (evt: MouseEvent) => {
      if (ref.current?.contains(evt.target as Node)) {
        return;
      }

      if (dropdownOpen) {
        setSelectOpen({ open: false, focus: false });
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
      setSelectOpen({ open: !dropdownOpen, focus: true });
      return;
    }

    if (['Esc', 'Escape'].includes(event.key)) {
      event.preventDefault();
      setSelectOpen({ open: false, focus: true });
      return;
    }

    if (['ArrowDown'].includes(event.key)) {
      event.preventDefault();
      setToMatch('');

      if (!dropdownOpen) {
        setSelectOpen({ open: true, focus: true });
        return;
      }

      const nextEl = document.activeElement === ref.current ? optionRefs.current?.[0]?.el : document.activeElement?.nextElementSibling;
      (nextEl as HTMLElement | undefined)?.focus();
      nextEl?.scrollIntoView({ block: 'nearest' });
      return;
    }

    if (['Tab'].includes(event.key) && dropdownOpen) {
      setSelectOpen({ open: false, focus: true });
      return;
    }

    if (['ArrowUp'].includes(event.key)) {
      event.preventDefault();
      setToMatch('');

      if (!dropdownOpen) {
        return;
      }

      if (document.activeElement === optionRefs.current?.[0]?.el) {
        setSelectOpen({ open: false, focus: true });
        return;
      }

      const prevEl = document.activeElement?.previousElementSibling as HTMLElement | null | undefined;
      prevEl?.focus();
      prevEl?.scrollIntoView({ block: 'nearest' });
      return;
    }

    if (/^[A-Za-z0-9]$/.test(event.key)) {
      event.preventDefault();
      event.stopPropagation();

      setToMatch(toMatch + event.key.toLowerCase());
      setSelectOpen({ open: true, focus: false });
    }
  };

  const optionKeydown = (o: T) => (event: JSX.TargetedKeyboardEvent<HTMLDivElement>) => {
    if (['Enter', ' ', 'Spacebar'].includes(event.key)) {
      chooseOption(o);
    }
  };

  const clearCurrentValue = (
    mouseEvent?: JSX.TargetedMouseEvent<HTMLAnchorElement> | JSX.TargetedKeyboardEvent<HTMLAnchorElement>,
    keyboardEvent?: JSX.TargetedKeyboardEvent<HTMLAnchorElement>
  ) => {
    if (shouldDisable) {
      return;
    }

    if (keyboardEvent) {
      if (!['Enter', ' ', 'Spacebar'].includes(keyboardEvent.key)) {
        return;
      }

      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();
    }

    if (mouseEvent) {
      mouseEvent.preventDefault();
      mouseEvent.stopPropagation();
    }

    setSelectOpen({ open: false, focus: true });
    onChange(null);
  };

  return (
    <Fragment>
      {label && <label htmlFor={id}>{label}</label>}
      <div
        ref={ref}
        style={{ width: typeof width === 'string' ? width : `${width}px` }}
        className={`select ${isError ? 'error' : ''} ${isDisabled ? 'disabled' : ''} ${className ? className : ''} ${height}`}
        tabIndex={0}
        onClick={() => setSelectOpen({ open: !dropdownOpen, focus: true })}
        onKeyDown={selectKeydown}
      >
        <div className="select-box">
          <span className="select-box--selected-text">{renderCurrent()}</span>
          {clearable && value && (
            <a className="select-box--clear" tabIndex={0} onClick={clearCurrentValue} onKeyDown={(e) => clearCurrentValue(undefined, e)}>
              X
            </a>
          )}
          <img className="select-box--caret" src="/assets/icons/caret_down.svg" />
        </div>
        {dropdownOpen && (
          <div className="select-dropdown">
            <div className="scroll-wrapper">
              {options?.map((o: NonNullable<T>, i) =>
                <div
                  data-testid="select-dropdown-option"
                  className={`select-option${value != null && mapToKey(value, i) === mapToKey(o, i) ? ' select-option--chosen' : ''}`}
                  tabIndex={-1}
                  ref={(ref) => (optionRefs.current[i] = { el: ref as HTMLDivElement, key: mapToKey(o, i) })}
                  key={mapToKey(o, i)}
                  onKeyDown={optionKeydown(o)}
                  onClick={() => chooseOption(o)}>
                  <span>{render(o)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {errorText && <p>{errorText}</p>}
      {!errorText && helpText && <p>{helpText}</p>}
    </Fragment>
  );
};

export default Select;
