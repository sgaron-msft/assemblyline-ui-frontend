import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useMySnackbar from 'components/hooks/useMySnackbar';
import type { AlertSearchParams } from 'components/routes/alerts';
import { useDefaultParams } from 'components/routes/alerts/contexts/DefaultParamsContext';
import { useSearchParams } from 'components/routes/alerts/contexts/SearchParamsContext';
import type { SearchResult } from 'components/routes/alerts/utils/SearchParser';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import AlertFiltersSelected from './FiltersSelected';

const useStyles = makeStyles(theme => ({
  preview: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    columnGap: theme.spacing(1),
    margin: 0,
    padding: theme.spacing(1.5),
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[200]
  },
  dialogPaper: {
    maxWidth: '1000px'
  },
  dialogContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(2),
    '@media (max-width:850px)': {
      gridTemplateColumns: '1fr'
    }
  },
  dialogDescription: {
    gridColumn: 'span 2',
    '@media (max-width:850px)': {
      gridColumn: 'span 1'
    }
  }
}));

const WrappedAlertDefaultSearchParameters = () => {
  const { t } = useTranslation('alerts');
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccessMessage } = useMySnackbar();
  const { search } = useSearchParams<AlertSearchParams>();
  const { defaults, fromStorage, onDefaultChange, onDefaultClear } = useDefaultParams<AlertSearchParams>();

  const [open, setOpen] = useState<boolean>(false);
  const [isSameParams, setIsSameParams] = useState<boolean>(false);

  const filteredDefaults = useMemo<SearchResult<AlertSearchParams>>(
    () => defaults.filter(k => ['fq', 'group_by', 'sort', 'tc'].includes(k)),
    [defaults]
  );

  const filteredSearch = useMemo<SearchResult<AlertSearchParams>>(
    () => search.filter(k => ['fq', 'group_by', 'sort', 'tc'].includes(k)),
    [search]
  );

  useEffect(() => {
    if (!open) return;
    setIsSameParams(filteredSearch.toString() === filteredDefaults.toString());
  }, [filteredDefaults, filteredSearch, open]);

  return (
    <>
      <Tooltip title={t('session.tooltip')}>
        <div>
          <IconButton size="large" onClick={() => setOpen(true)}>
            <ManageSearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <Dialog classes={{ paper: classes.dialogPaper }} open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t('session.title')}</DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <div className={classes.dialogDescription}>{t('session.description')}</div>

          <Grid item style={{ width: '100%' }}>
            <Typography variant="subtitle2">{t('session.existing')}</Typography>
            <Paper component="pre" variant="outlined" className={classes.preview}>
              {filteredDefaults.toString() === '' ? (
                <div>{t('none')}</div>
              ) : (
                <AlertFiltersSelected value={defaults.toObject()} visible={['fq', 'group_by', 'sort', 'tc']} disabled />
              )}
            </Paper>
          </Grid>

          <Grid item style={{ width: '100%' }}>
            <Typography variant="subtitle2">{t('session.current')}</Typography>
            <Paper component="pre" variant="outlined" className={classes.preview}>
              {filteredSearch.toString() === '' ? (
                <div>{t('none')}</div>
              ) : (
                <AlertFiltersSelected value={search.toObject()} visible={['fq', 'group_by', 'sort', 'tc']} disabled />
              )}
            </Paper>
          </Grid>

          <div>{fromStorage ? t('session.clear.confirm') : t('session.clear.none')}</div>

          <div>
            {isSameParams
              ? t('session.save.same')
              : filteredSearch.toString() === ''
              ? t('session.save.none')
              : t('session.save.confirm')}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={!fromStorage}
            children={t('session.clear')}
            onClick={() => {
              onDefaultClear();
              navigate(`${location.pathname}${location.hash}`);
              showSuccessMessage(t('session.clear.success'));
              setOpen(false);
            }}
          />
          <div style={{ flex: 1 }} />
          <Button autoFocus color="secondary" children={t('session.cancel')} onClick={() => setOpen(false)} />
          <Button
            color="primary"
            disabled={filteredSearch.toString() === '' || isSameParams}
            children={t('session.save')}
            onClick={() => {
              onDefaultChange(search.toParams());
              navigate(`${location.pathname}${location.hash}`);
              showSuccessMessage(t('session.save.success'));
              setOpen(false);
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export const AlertDefaultSearchParameters = React.memo(WrappedAlertDefaultSearchParameters);
export default AlertDefaultSearchParameters;