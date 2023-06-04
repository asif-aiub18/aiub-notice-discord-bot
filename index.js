const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://www.aiub.edu/category/notices';
let previousNotices = [];

function fetchNotices() {
  axios.get(url)
    .then(response => {
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);

        const notices = [];

        $('div.blog-post').each((index, element) => {
          const title = $(element).find('.info').text().trim();
          const link = $(element).find('.info-link').attr('href');

          notices.push({ title, link });
        });

        checkNewNotices(notices);
        previousNotices = notices;
      }
    })
    .catch(error => {
      console.log(error);
    });
}

function checkNewNotices(currentNotices) {
  const newNotices = currentNotices.filter(notice => {
    return !previousNotices.some(prevNotice => prevNotice.title === notice.title);
  });

  if (newNotices.length > 0) {
    console.log('New Notices:');
    newNotices.forEach(notice => {
      console.log('Title:', notice.title);
      console.log('Link:', notice.link);
      console.log('---');
    });
  }
}

fetchNotices();
setInterval(fetchNotices, 30000); // Fetch every 1 minute
