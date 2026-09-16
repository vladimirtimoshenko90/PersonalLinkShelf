import type { ResourceCatalog } from '@/database';
import styles from './CatalogCard.module.scss';

export default function CatalogView({ catalog }: { catalog: ResourceCatalog }) {
  return <span className={styles.catalogView}>{catalog.name}</span>;
}
