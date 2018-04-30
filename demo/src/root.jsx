import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Link from 'next/link';
import Divider from 'material-ui/Divider';
import { withRouter } from 'next/router';
import { asPath } from './utils';

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
  toolbar: theme.mixins.toolbar
});

const PageTitle = withRouter(({ router, href }) => (
  <Typography variant="title" color="inherit" noWrap>
    {`@pie-lib/${router.pathname.split('/')[1]}`}
  </Typography>
));

const ActiveLink = withStyles(theme => ({
  active: {
    color: theme.palette.primary.main
  }
}))(
  withRouter(({ router, path, primary, classes }) => {
    const isActive = path === router.pathname;
    return (
      <Link href={path} as={asPath(path)}>
        <ListItem button>
          <ListItemText
            primary={primary}
            classes={{ primary: isActive && classes.active }}
          />
        </ListItem>
      </Link>
    );
  })
);

function ClippedDrawer(props) {
  const { classes, children, links } = props;

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <PageTitle />
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
            <ActiveLink key={index} path={l.path} primary={l.label} />
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

ClippedDrawer.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired
    })
  ).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ClippedDrawer);
