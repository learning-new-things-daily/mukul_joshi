(function(){
  // Auto-detect base path for GitHub Pages vs local
  var path = window.location.pathname || '/';
  var match = path.match(/^\/(.+?)\//);
  var base = match ? ('/' + match[1] + '/') : '/';
  window.__BASE_PATH__ = base; // e.g., '/devops-hub/'
})();
