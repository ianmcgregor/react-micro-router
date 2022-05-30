import React from "react";

export const isReactElement = (element: any): element is React.ReactElement => {
  return typeof element === 'object' && element !== null && element.$$typeof === Symbol.for('react.element');
};