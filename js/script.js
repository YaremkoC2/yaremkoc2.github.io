document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.navBox').forEach(box => {
    const link = box.getAttribute('data-link');
    if (link) {
      box.style.cursor = 'pointer';
      box.addEventListener('click', () => {
        const isInternal = link.endsWith('.html');
        window.open(link, isInternal ? '_self' : '_blank');
      });
    }
  });
});
