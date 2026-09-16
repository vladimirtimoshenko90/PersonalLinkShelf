import CatalogDraft from './CatalogDraft/CatalogDraft.tsx';
import type { CatalogKind } from '@/database';
import PanelBody from './PanelBody/PanelBody.tsx';
import PanelFooter from './PanelFooter/PanelFooter.tsx';
import { useState } from 'react';

export default function App() {
  const [draftKind, setDraftKind] = useState<CatalogKind | null>(null);

  return (
    <>
      {draftKind && (
        <CatalogDraft key={draftKind} kind={draftKind} onDone={() => setDraftKind(null)} />
      )}
      <PanelBody />
      <PanelFooter onPickKind={setDraftKind} />
    </>
  );
}
