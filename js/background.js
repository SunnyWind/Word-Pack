chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('html/main.html', {
    'outerBounds': {
      'width': 800,
      'height': 800
    }
  });
});