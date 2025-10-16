import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import Divider from '@mui/material/Divider';
import { withRouter } from 'next/router';
import ChangelogDialog from './changelog-dialog';

const drawerWidth = 240;

const RootContainer = styled('div')(({ theme }) => ({
  flexGrow: 1,
  zIndex: 1,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  fontFamily: '"Roboto", sans-serif',
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const StyledDrawer = styled(Drawer)({
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: drawerWidth,
  },
});

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  minWidth: 0, // So the Typography noWrap works
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  ...theme.mixins.toolbar,
  display: 'flex',
  justifyContent: 'space-between',
  '&.dev': {
    backgroundColor: 'orange',
  },
}));

const ToolbarSpacer = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const Extras = styled('div')({
  float: 'right',
});

const ActiveListItemText = styled(ListItemText)(({ theme, active }) => ({
  '& .MuiListItemText-primary': {
    color: active ? theme.palette.primary.main : 'inherit',
  },
}));

const VersionSpan = styled('span')(({ theme, active }) => ({
  fontSize: '11px',
  color: active ? theme.palette.primary.main : theme.palette.secondary.main,
  cursor: active ? 'pointer' : 'default',
}));

const PageTitle = withRouter(({ router }) => {
  const name = router.pathname.split('/')[1];
  const title = name ? `@pie-lib/${name}` : '@pie-lib';

  return (
    <Typography variant="h6" color="inherit" noWrap>
      {title}
    </Typography>
  );
});

const ActiveLink = withRouter(({ router, path, primary, version, onVersionClick }) => {
  const isActive = path === router.pathname;
  return (
    <Link href={path} as={path}>
      <ListItem button>
        <ActiveListItemText primary={primary} active={isActive} />
        {version && (
          <VersionSpan active={isActive} onClick={isActive ? () => onVersionClick(path) : undefined}>
            {version}
          </VersionSpan>
        )}
      </ListItem>
    </Link>
  );
});

class ClippedDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      changelogOpen: false,
    };
  }

  showChangeLog = (path) => {
    this.setState({ changelogOpen: true, changelogPath: path });
  };

  hideDialog = () => {
    this.setState({ changelogOpen: false, changelogPath: undefined });
  };

  render() {
    const { children, links, gitInfo, packageInfo } = this.props;
    const { changelogOpen, changelogPath } = this.state;

    const clPackage = changelogOpen
      ? packageInfo.find((pi) => {
          return pi.dir.endsWith(changelogPath);
        })
      : undefined;

    return (
      <RootContainer>
        <StyledAppBar position="absolute">
          <StyledToolbar className={gitInfo.branch !== 'master' ? 'dev' : ''}>
            <PageTitle />
            <Extras>
              {gitInfo.branch}&nbsp;|&nbsp;
              <a href={`https://github.com/pie-framework/pie-lib/commit/${gitInfo.short}`}>{gitInfo.short}</a>
            </Extras>
          </StyledToolbar>
        </StyledAppBar>
        <StyledDrawer variant="permanent">
          <ToolbarSpacer />
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
        </StyledDrawer>
        <MainContent>
          <ToolbarSpacer />
          {children}
        </MainContent>
        <ChangelogDialog open={changelogOpen} onClose={this.hideDialog} activePackage={clPackage} />
      </RootContainer>
    );
  }
}

ClippedDrawer.propTypes = {
  gitInfo: PropTypes.object,
  packageInfo: PropTypes.array,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }),
  ).isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default ClippedDrawer;
