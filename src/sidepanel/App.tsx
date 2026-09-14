import CatalogDraft from './CatalogDraft/CatalogDraft.tsx';
import type { CatalogKind } from '@/types';
import PanelBody from './PanelBody/PanelBody.tsx';
import PanelHeader from './PanelHeader/PanelHeader.tsx';
import SaveNotice from './SaveNotice/SaveNotice.tsx';
import { useState } from 'react';

export default function App() {
  const [draftKind, setDraftKind] = useState<CatalogKind | null>(null);

  return (
    <>
      <PanelHeader onPickKind={setDraftKind} />
      {draftKind && (
        <CatalogDraft key={draftKind} kind={draftKind} onDone={() => setDraftKind(null)} />
      )}
      <SaveNotice />
      <PanelBody />
    </>
  );
}
