import {
  createStyles,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  withStyles
} from '@material-ui/core';
import { default as React } from 'react';
import TitleKey from '../TitleKey';
import { KVBody } from './kv_body';

const useStyles = printable =>
  makeStyles(theme => ({
    root: {
      [theme.breakpoints.down('sm')]: {
        width: printable ? '100%' : 'max-content'
      }
    }
  }))();

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '@media print': {
        color: 'black'
      },
      fontSize: 'inherit',
      lineHeight: 'inherit'
    },
    head: {
      '@media print': {
        color: 'black',
        backgroundColor: '#DDD !important'
      },
      backgroundColor: theme.palette.type === 'dark' ? '#404040' : '#EEE'
    },
    body: {
      [theme.breakpoints.up('md')]: {
        wordBreak: 'break-word'
      }
    }
  })
)(TableCell);

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      '&:nth-of-type(odd)': {
        '@media print': {
          backgroundColor: '#EEE !important'
        },
        backgroundColor: theme.palette.type === 'dark' ? '#ffffff08' : '#00000008'
      }
    }
  })
)(TableRow);

const WrappedTblBody = ({ body, printable }) => {
  const headers = [];
  const classes = useStyles(printable);

  if (body) {
    for (const line of body) {
      // eslint-disable-next-line guard-for-in
      for (const th in line) {
        const val = line[th];
        if (val !== null && val !== '') {
          if (!headers.includes(th)) {
            headers.push(th);
          }
        }
      }
    }
  }

  return (
    body && (
      <TableContainer
        style={{ fontSize: '90%', maxHeight: printable ? null : '500px', maxWidth: printable ? '100%' : null }}
      >
        <Table stickyHeader size="small" classes={{ root: classes.root }}>
          <TableHead>
            <TableRow>
              {headers.map((th, id) => (
                <StyledTableCell key={id}>
                  <TitleKey title={th} />
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ wordBreak: printable ? 'break-word' : null }}>
            {body.map((row, id) => (
              <StyledTableRow key={id}>
                {headers.map((key, hid) => {
                  let value = row[key];
                  if (value instanceof Array) {
                    value = value.join(' | ');
                  } else if (value === true) {
                    value = 'true';
                  } else if (value === false) {
                    value = 'false';
                  } else if (typeof value === 'object' && value !== null && value !== undefined) {
                    value = <KVBody body={value} />;
                  }
                  return <StyledTableCell key={hid}>{value}</StyledTableCell>;
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export const TblBody = React.memo(WrappedTblBody);