const ghpages = require('gh-pages');
const path = require('path');

const options = {
  branch: 'gh-pages',
  repo: 'https://github.com/ramcreator-portfolio/Portfolio.git', // Update this with your repo URL
  dotfiles: true,
  message: 'Deploy to GitHub Pages',
};

ghpages.publish(path.join(__dirname, 'dist'), options, function(err) {
  if (err) {
    console.error('Deployment failed:', err);
    process.exit(1);
  } else {
    console.log('✅ Successfully deployed to GitHub Pages!');
  }
});
