// Reads ?file=assets/docs/whatever.pdf&title=Some+Title from the URL
// and wires up the iframe + download link + headings on view.html.
//
// Example link from index.html:
//   <a href="view.html?file=assets/docs/writing-sample-1.pdf&title=Companion%20Dialogue%20Tree">View in browser</a>

(function () {
  const params = new URLSearchParams(window.location.search);
  const file = params.get('file');
  const title = params.get('title') || 'Writing sample';

  const frame = document.getElementById('pdfFrame');
  const frameWrap = document.getElementById('pdfFrameWrap');
  const fallback = document.getElementById('pdfFallback');
  const downloadLink = document.getElementById('downloadLink');
  const docTitle = document.getElementById('docTitle');
  const pageTitle = document.getElementById('pageTitle');

  if (!file) {
    // No filename supplied — show the fallback message instead of an empty frame.
    frameWrap.hidden = true;
    fallback.hidden = false;
    downloadLink.hidden = true;
    return;
  }

  docTitle.textContent = title;
  pageTitle.textContent = title + ' — Jane Doe';
  frame.src = file;
  downloadLink.href = file;
  downloadLink.setAttribute('download', '');

  // If the PDF genuinely 404s, swap to the fallback message. We deliberately
  // do NOT hide the viewer just because fetch() throws — that also happens
  // when this page is opened directly as a file:// URL (browsers block
  // fetch() there for security reasons) even though the PDF itself loads
  // fine in the iframe. Only a confirmed non-OK response counts as "missing."
  fetch(file, { method: 'HEAD' })
    .then((res) => {
      if (!res.ok) {
        frameWrap.hidden = true;
        fallback.hidden = false;
        downloadLink.hidden = true;
        docTitle.textContent = 'Document not found';
      }
    })
    .catch(() => {
      // fetch() itself failed (e.g. file:// restrictions) — leave the
      // iframe as-is rather than assuming the PDF is missing.
    });
})();
