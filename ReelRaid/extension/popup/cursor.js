// Custom cursor implementation
document.addEventListener('DOMContentLoaded', function() {
  // Create cursor element
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);
  
  // Update cursor position on mouse move
  document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
  
  // Add hover effect for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, .platform-card');
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });
    element.addEventListener('mouseleave', function() {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
});
