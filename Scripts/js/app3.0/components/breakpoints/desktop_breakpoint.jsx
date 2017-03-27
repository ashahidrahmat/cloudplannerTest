import React from 'react';
import Breakpoint from 'components/breakpoints/breakpoint';

const { object } = React.PropTypes;

export default function DesktopBreakpoint(props) {
  return (
    <Breakpoint name="desktop">
      {props.children}
    </Breakpoint>
  );
}

DesktopBreakpoint.propTypes = {
  children: object,
};
