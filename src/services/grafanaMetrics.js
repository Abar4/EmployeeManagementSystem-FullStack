// Simple client-side helper to notify the metrics server about frontend events.
export async function recordPageLoad() {
  try {
    await fetch("http://localhost:3001/events/page_load", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
  } catch (err) {
    // swallow errors in frontend to avoid breaking the app
    // optionally log to console for development
    console.debug('Failed to record page load metric:', err);
  }
}

export default { recordPageLoad };
