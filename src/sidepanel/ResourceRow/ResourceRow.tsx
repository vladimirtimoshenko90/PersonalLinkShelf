import { GripVertical, Link } from 'lucide-react';

import type { WebResource } from '@/database';
import styles from './ResourceRow.module.scss';

export default function ResourceRow({ resource }: { resource: WebResource }) {
  const title = resource.title?.trim() ?? '';
  const url = resource.url?.trim() ?? '';
  const label = title !== '' ? title : url;
  const urlAsLabel = title === '' && url !== '';

  return (
    <div className={styles.root}>
      <button type="button" className={styles.ico}>
        <GripVertical size={16} />
      </button>
      <span className={urlAsLabel ? `${styles.label} ${styles.url}` : styles.label}>{label}</span>
      {url !== '' ? (
        <span className={styles.mark}>
          <Link size={16} />
        </span>
      ) : null}
    </div>
  );
}
