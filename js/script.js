document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.navBox').forEach(box => {
    const link = box.getAttribute('data-link');
    if (link) {
      box.style.cursor = 'pointer';
      box.addEventListener('click', () => {
        window.open(link, '_blank');
      });
    }
  });
});
