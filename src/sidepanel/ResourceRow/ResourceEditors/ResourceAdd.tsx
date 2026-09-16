import type { ResourceCatalog } from '@/database';
import { shelfStore } from '@/store';
import ResourceForm from './ResourceForm/ResourceForm.tsx';

export default function ResourceAdd({ catalog }: { catalog: ResourceCatalog }) {
  return (
    <ResourceForm
      initial={{ title: '', url: '' }}
      captureTab
      onSave={(title, url) => shelfStore.createResource(catalog.id, title, url)}
    />
  );
}
