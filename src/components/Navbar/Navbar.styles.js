import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  active: {
    marginRight: theme.spacing(2),
    fontWeight: theme.typography.fontWeightMedium,
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'white',
      textDecoration: 'none'
    }
  },
  inactive: {
    marginRight: theme.spacing(2),
    fontWeight: theme.typography.fontWeightLight,
    color: '#bfbfbf',
    textDecoration: 'none',
    '&:hover': {
      backgroundColor: 'transparent',
      color: '#f2f2f2',
      textDecoration: 'none'
    }
  }
}));
