import type { WebResource } from '@/database';
import { shelfStore } from '@/store';
import ResourceForm from './ResourceForm/ResourceForm.tsx';

export default function ResourceEdit({ resource }: { resource: WebResource }) {
  return (
    <ResourceForm
      initial={{ title: resource.title ?? '', url: resource.url ?? '' }}
      onSave={(title, url) => shelfStore.updateResource(resource.id, title, url)}
    />
  );
}
