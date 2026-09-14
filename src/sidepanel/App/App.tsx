import PanelBody from '../PanelBody/PanelBody.tsx';
import PanelHeader from '../PanelHeader/PanelHeader.tsx';
import SaveNotice from '../SaveNotice/SaveNotice.tsx';
import styles from './App.module.scss';

export default function App() {
  return (
    <div className={styles.root}>
      <PanelHeader />
      <SaveNotice />
      <PanelBody />
    </div>
  );
}
