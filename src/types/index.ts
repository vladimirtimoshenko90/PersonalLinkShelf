export type CatalogKind = 'topic' | 'project'

export interface ResourceCatalog {
  id: string
  name: string
  kind: CatalogKind
  order: number
  collapsed: boolean
  createdAt: number
}

export interface WebResource {
  id: string
  catalogId: string
  title: string | null
  url: string | null
  order: number
  createdAt: number
}

export interface ShelfBlob {
  schemaVersion: 1
  catalogs: ResourceCatalog[]
  resources: WebResource[]
}
