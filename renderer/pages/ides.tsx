import React from 'react';
import Layout from '../components/Layout';
import SpaceAround from '../components/SpaceAround';
import { makeStyles } from '@material-ui/core/styles';
import EclipseCard from '../components/cards/ideCards/eclipse/eclipse-card.controller';
import VSCodeCard from '../components/cards/ideCards/vscode-card/vscode-card.controller';
import IntellijCard from '../components/cards/ideCards/intellij/intellij-card.controller';

const useStyles = makeStyles({
  cardsContainer: {
    display: 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'space-evenly',
  },
});

export default function MediaCard() {
  const classes = useStyles();

  return (
    <Layout>
      <SpaceAround>
        <div className={classes.cardsContainer}>
          <EclipseCard></EclipseCard>
          <VSCodeCard></VSCodeCard>
          <IntellijCard></IntellijCard>
        </div>
      </SpaceAround>
    </Layout>
  );
}
