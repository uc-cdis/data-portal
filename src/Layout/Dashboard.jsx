import React from 'react';
import PropTypes from 'prop-types';
import './Dashboard.css';

function Dashboard({ children, className }) {
  return (
    <div className={`dashboard ${className ?? ''}`.trim()}>{children}</div>
  );
}

Dashboard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function Main({ children, className }) {
  return (
    <div className={`dashboard__main ${className ?? ''}`.trim()}>
      {children}
    </div>
  );
}

Main.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

function Sidebar({ children, className }) {
  return (
    <div className={`dashboard__sidebar ${className ?? ''}`.trim()}>
      {children}
    </div>
  );
}

Sidebar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

Dashboard.Main = Main;
Dashboard.Sidebar = Sidebar;

export default Dashboard;
