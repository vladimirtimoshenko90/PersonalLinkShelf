export function toggleSidebarOnAction(): void {
  void chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}
