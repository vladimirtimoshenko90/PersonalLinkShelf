import Body from '../Body/Body.tsx';
import Header from '../Header/Header.tsx';
import SaveNotice from '../SaveNotice/SaveNotice.tsx';
import styles from './App.module.scss';

export default function App() {
  return (
    <div className={styles.root}>
      <Header />
      <SaveNotice />
      <Body />
    </div>
  );
}
