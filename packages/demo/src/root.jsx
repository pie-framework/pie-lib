import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Link from 'next/link';
import Divider from '@material-ui/core/Divider';
import { withRouter } from 'next/router';
import classNames from 'classnames';
import ChangelogDialog from './changelog-dialog';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    fontFamily: '"Roboto", sans-serif'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    minWidth: 0 // So the Typography noWrap works
  },
  toolbar: {
    ...theme.mixins.toolbar,
    display: 'flex',
    justifyContent: 'space-between'
  },
  devToolbar: {
    backgroundColor: 'orange'
  },
  extras: {
    float: 'right'
  }
});

const PageTitle = withRouter(({ router }) => {
  const name = router.pathname.split('/')[1];
  const title = name ? `@pie-lib/${name}` : '@pie-lib';

  return (
    <Typography variant="h6" color="inherit" noWrap>
      {title}
    </Typography>
  );
});

const ActiveLink = withStyles(theme => ({
  active: {
    color: theme.palette.primary.main
  },
  version: {
    fontSize: '11px',
    color: theme.palette.secondary.main
  },
  versionActive: {
    color: theme.palette.primary.main
  }
}))(
  withRouter(({ router, path, primary, classes, version, onVersionClick }) => {
    const isActive = path === router.pathname;
    return (
      <Link href={path} as={path}>
        <ListItem button>
          <ListItemText primary={primary} classes={{ primary: isActive && classes.active }} />
          {version && (
            <span
              onClick={isActive ? () => onVersionClick(path) : undefined}
              className={classNames(classes.version, isActive && classes.versionActive)}
            >
              {version}
            </span>
          )}
        </ListItem>
      </Link>
    );
  })
);

class ClippedDrawer extends React.Component {
  //(props) {

  constructor(props) {
    super(props);
    this.state = {
      changelogOpen: false
    };
  }

  showChangeLog = path => {
    this.setState({ changelogOpen: true, changelogPath: path });
  };

  hideDialog = () => {
    this.setState({ changelogOpen: false, changelogPath: undefined });
  };

  render() {
    const { classes, children, links, gitInfo, packageInfo } = this.props;
    const { changelogOpen, changelogPath } = this.state;

    const clPackage = changelogOpen
      ? packageInfo.find(pi => {
          return pi.dir.endsWith(changelogPath);
        })
      : undefined;

    return (
      <div className={classes.root}>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar
            className={classNames(
              classes.toolbar,
              gitInfo.branch !== 'master' && classes.devToolbar
            )}
          >
            <PageTitle />

            <div className={classes.extras}>
              {gitInfo.branch}&nbsp;|&nbsp;
              <a href={`https://github.com/pie-framework/pie-lib/commit/${gitInfo.short}`}>
                {gitInfo.short}
              </a>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ActiveLink path="/" primary={'Home'} />
            <Divider />
            {links.map((l, index) => (
              <ActiveLink
                key={index}
                path={l.path}
                primary={l.label}
                onVersionClick={this.showChangeLog}
                version={gitInfo.branch === 'master' ? l.version : l.version ? 'next' : undefined}
              />
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {children}
        </main>
        <ChangelogDialog open={changelogOpen} onClose={this.hideDialog} activePackage={clPackage} />
      </div>
    );
  }
}

ClippedDrawer.propTypes = {
  gitInfo: PropTypes.object,
  packageInfo: PropTypes.array,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ClippedDrawer);
