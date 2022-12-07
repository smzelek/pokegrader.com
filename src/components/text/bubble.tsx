import { h } from 'preact';
import { JSXChildren } from "src/utils";

export const Bubble = ({ children }: { children: JSXChildren }) => <span className="bubble-font">{children}</span>;
