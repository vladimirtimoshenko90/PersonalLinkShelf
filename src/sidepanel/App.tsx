import { useState } from 'react';

import type { CatalogKind } from '@/database';
import CatalogDraft from './CatalogDraft/CatalogDraft.tsx';
import PanelBody from './PanelBody/PanelBody.tsx';
import PanelHeader from './PanelHeader/PanelHeader.tsx';

export default function App() {
  const [draftKind, setDraftKind] = useState<CatalogKind | null>(null);

  return (
    <>
      <PanelHeader onPickKind={setDraftKind} />
      {draftKind && (
        <CatalogDraft key={draftKind} kind={draftKind} onDone={() => setDraftKind(null)} />
      )}
      <PanelBody />
    </>
  );
}
