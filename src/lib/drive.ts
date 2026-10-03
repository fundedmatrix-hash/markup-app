export async function connectGoogleDrive() {
  return {
    connected: false,
    message: 'Google Drive is optional. MARKUP supports browser OAuth flows and secure folder sync only when enabled by the user.'
  };
}

export async function saveToGoogleDrive(data: Blob, folderName: string) {
  return {
    ok: false,
    folderName,
    message: 'Drive save is intentionally optional. No account is required for local-first use.',
    dataSize: data.size
  };
}
