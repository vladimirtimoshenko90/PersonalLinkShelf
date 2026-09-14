import { observer } from 'mobx-react-lite';
import { shelfStore } from '@/store';
import styles from './SaveNotice.module.scss';

export default observer(function SaveNotice() {
  if (!shelfStore.saveFailed) {
    return null;
  }

  return <p className={styles.root}>Couldn't save.</p>;
});
