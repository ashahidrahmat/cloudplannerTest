import React from 'react';
import Breakpoint from 'components/breakpoints/breakpoint';

const { object } = React.PropTypes;

export default function TabletBreakpoint(props) {
  return (
    <Breakpoint name="tablet">
      {props.children}
    </Breakpoint>
  );
}

TabletBreakpoint.propTypes = {
  children: object,
};
