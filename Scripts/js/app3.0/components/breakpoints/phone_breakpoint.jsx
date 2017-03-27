import React from 'react';
import Breakpoint from 'components/breakpoints/breakpoint';

const { object } = React.PropTypes;

export default function PhoneBreakPoint(props) {
  return (
    <Breakpoint name="phone">
      {props.children}
    </Breakpoint>
  );
}

PhoneBreakPoint.propTypes = {
  children: object,
};
